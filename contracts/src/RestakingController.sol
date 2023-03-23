// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "solmate/utils/FixedPointMathLib.sol";
import "./cryptography/BLSverifier.sol";

interface IDepositContract {
    function deposit(
        bytes calldata pubkey,
        bytes calldata withdrawal_credentials,
        bytes calldata signature,
        bytes32 deposit_data_root
    ) external payable;
}

contract RestakingController {
    uint256 constant GWEI = 1e9;

    struct Account {
        uint256 effectiveBalance;
        uint256 amountRestaked;
        mapping(address => uint256) amountRestakedPerModule;
        uint256 slashedAmount; // withdrawal amount is effectiveBalance - slashedAmount
            // NOTE: the slashAmount could be negative, which means that the account has been rewarded (and someone else got slashed)
    }

    IDepositContract immutable depositContract;
    bytes32 immutable DEPOSIT_DOMAIN;
    bytes WITHDRAWALS_CREDENTIALS; // points to upgradeable proxy contract

    mapping(bytes => Account) accounts; // BLS pubkey => Account

    // functions with this modifier can only be called by the module contract
    modifier onlyModule(address module) virtual {
        require(msg.sender == module, "Only the module contract can call this function");
        _;
    }

    modifier validatePubkeyLength(bytes memory pubkey) {
        require(pubkey.length == 48, "invalid pubkey length");
        _;
    }

    modifier validateSignatureLength(bytes memory signature) {
        require(signature.length == 96, "invalid signature length");
        _;
    }

    constructor(address _DEPOSIT_CONTRACT_ADDRESS, bytes memory _WITHDRAWALS_CREDENTIALS, bytes32 _DEPOSIT_DOMAIN) {
        require(_WITHDRAWALS_CREDENTIALS.length == 32, "invalid _WITHDRAWALS_CREDENTIALS length");

        depositContract = IDepositContract(_DEPOSIT_CONTRACT_ADDRESS);
        WITHDRAWALS_CREDENTIALS = _WITHDRAWALS_CREDENTIALS;
        DEPOSIT_DOMAIN = _DEPOSIT_DOMAIN;
    }

    /* NOTE: validate the deposit data here so that we can update the account's effectiveBalance immediately \
        (instead of waiting for the deposit to be processed) */
    function deposit(
        bytes calldata pubkey,
        bytes calldata signature,
        bytes32 depositDataRoot,
        DepositVerifier.Fp calldata publicKeyYCoordinate,
        DepositVerifier.Fp2 calldata signatureYCoordinate
    ) external payable {
        bytes32 firstNode;
        bytes32 secondNode;
        {
            bytes32 pubkeyRoot = sha256(abi.encodePacked(pubkey, bytes16(0)));

            uint256 deposit_amount = msg.value / GWEI;
            bytes memory amountRoot = new bytes(64);
            bytes memory serializedAmount = to_little_endian_64(uint64(deposit_amount));

            for (uint256 i = 0; i < 8;) {
                amountRoot[i] = serializedAmount[i];
                unchecked {
                    i++;
                }
            }

            firstNode = sha256(abi.encodePacked(pubkeyRoot, WITHDRAWALS_CREDENTIALS));
            secondNode = sha256(amountRoot);
        }
        bytes32 signingRoot = sha256(abi.encodePacked(sha256(abi.encodePacked(firstNode, secondNode)), DEPOSIT_DOMAIN));

        /*
        require(
            DepositVerifier.blsSignatureIsValid(
                signingRoot, pubkey, signature, publicKeyYCoordinate, signatureYCoordinate
            ),
            "BLS signature verification failed"
        );*/

        _deposit(pubkey, signature, depositDataRoot);
    }

    // here we can restake the ETH POS stake into a restaking module, and the module will be able to slash the stake
    function restake(
        address module,
        bytes calldata pubkey,
        uint256 restakeAmount,
        bytes32 ancillaryData,
        bytes calldata signature,
        DepositVerifier.Fp calldata publicKeyYCoordinate,
        DepositVerifier.Fp2 calldata signatureYCoordinate
    ) external onlyModule(module) validateSignatureLength(signature) {
        require(getUnusedStakeAmount(pubkey) >= restakeAmount, "Not enough stake available to restake");
        bytes32 firstNode;
        bytes32 secondNode;
        {
            bytes memory amount = to_little_endian_64(uint64(restakeAmount));

            bytes32 pubkey_root = sha256(abi.encodePacked(pubkey, bytes16(0)));

            firstNode = sha256(abi.encodePacked(pubkey_root, ancillaryData));
            secondNode = sha256(abi.encodePacked(bytes20(module), bytes12(0), amount, bytes24(0)));
        }

        bytes32 signingRoot = sha256(abi.encodePacked(firstNode, secondNode));

        require(
            DepositVerifier.blsSignatureIsValid(
                signingRoot, pubkey, signature, publicKeyYCoordinate, signatureYCoordinate
            ),
            "BLS signature verification failed"
        );

        _restake(module, pubkey, restakeAmount);
    }

    // this function is called by the module contract whenever a slash occurs
    function slash(address module, bytes calldata pubkeySlashed, uint256 amount) external onlyModule(module) {
        _slash(module, pubkeySlashed, amount);
    }

    function slashAndReward(address module, bytes calldata pubkeySlash, bytes calldata pubkeyReward, uint256 amount)
        external
        onlyModule(module)
    {
        _slash(module, pubkeySlash, amount);
        _reward(pubkeyReward, amount);
    }

    // reverts the restaking, and the stake is made available back to the staker
    function unrestake(address module, bytes calldata pubkey, uint256 amount) external onlyModule(module) {
        _unrestake(module, pubkey, amount);
    }

    function rewardWithETH(bytes calldata pubkey) external payable {
        _reward(pubkey, msg.value);
    }

    function rewardWithSignature(
        bytes calldata pubkeyFrom,
        bytes calldata pubkeyTo,
        uint256 rewardAmount,
        bytes calldata signature,
        DepositVerifier.Fp calldata publicKeyYCoordinate,
        DepositVerifier.Fp2 calldata signatureYCoordinate
    ) external payable validateSignatureLength(signature) {
        bytes memory amount = to_little_endian_64(uint64(rewardAmount));

        bytes32 pubkey_root = sha256(abi.encodePacked(pubkeyFrom, bytes16(0)));

        bytes32 signingRoot =
            sha256(abi.encodePacked(pubkey_root, sha256(abi.encodePacked(pubkeyTo, amount, bytes8(0)))));

        require(
            DepositVerifier.blsSignatureIsValid(
                signingRoot, pubkeyFrom, signature, publicKeyYCoordinate, signatureYCoordinate
            ),
            "BLS signature verification failed"
        );

        _defund(pubkeyFrom, rewardAmount);
        _reward(pubkeyTo, rewardAmount);
    }

    // VIEW-ONLY FUNCTIONS (TODO: stylize this)

    function getEthStakedAmount(bytes memory pubkey) public view returns (uint256 amount) {
        return accounts[pubkey].effectiveBalance;
    }

    function getUnusedStakeAmount(bytes memory pubkey) public view returns (uint256 amount) {
        // we are multiplying wads, so we have to convert 2 to 2 * 1e18 to have division by 2
        amount = FixedPointMathLib.divWadDown(getEthStakedAmount(pubkey), 2e18) - accounts[pubkey].amountRestaked
            - accounts[pubkey].slashedAmount;
    }

    // INTERNAL FUNCTIONS

    function _deposit(bytes calldata pubkey, bytes calldata signature, bytes32 depositDataRoot) internal {
        depositContract.deposit{value: msg.value}(pubkey, WITHDRAWALS_CREDENTIALS, signature, depositDataRoot);
        accounts[pubkey].effectiveBalance += msg.value;
    }

    function _restake(address module, bytes calldata pubkey, uint256 amount) internal validatePubkeyLength(pubkey) {
        accounts[pubkey].amountRestaked += amount;
        accounts[pubkey].amountRestakedPerModule[module] += amount;
    }

    function _unrestake(address module, bytes calldata pubkey, uint256 amount) internal validatePubkeyLength(pubkey) {
        require(
            accounts[pubkey].amountRestakedPerModule[module] >= amount,
            "Not enough stake restaked in the module by pubkey"
        );
        accounts[pubkey].amountRestaked -= amount;
        accounts[pubkey].amountRestakedPerModule[module] -= amount;
    }

    function _reward(bytes memory pubkey, uint256 amount) internal validatePubkeyLength(pubkey) {
        // TODO: modifier that gives an error if the amount is too big (otherwise, risk of protocol becoming insolvent)
        accounts[pubkey].slashedAmount -= amount;
    }

    function _defund(bytes memory pubkey, uint256 amount) internal validatePubkeyLength(pubkey) {
        // TODO: modifier that gives an error if the amount is too big for the pubkey's balance
        accounts[pubkey].slashedAmount += amount;
    }

    function _slash(address module, bytes calldata pubkeySlash, uint256 amount) internal {
        _unrestake(module, pubkeySlash, amount);
        _defund(pubkeySlash, amount);
    }

    function to_little_endian_64(uint64 value) internal pure returns (bytes memory ret) {
        ret = new bytes(8);
        bytes8 bytesValue = bytes8(value);
        // Byteswapping during copying to bytes.
        ret[0] = bytesValue[7];
        ret[1] = bytesValue[6];
        ret[2] = bytesValue[5];
        ret[3] = bytesValue[4];
        ret[4] = bytesValue[3];
        ret[5] = bytesValue[2];
        ret[6] = bytesValue[1];
        ret[7] = bytesValue[0];
    }
}
