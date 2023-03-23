// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/utils/FixedPointMathLib.sol";
import "solmate/utils/ReentrancyGuard.sol";
import "../../RestakingController.sol";

contract OptimisticOracle {
    /*//////////////////////////////////////////////////////////////
                                Variables
    //////////////////////////////////////////////////////////////*/

    /// @notice Format for oracle requests
    struct Request {
        bytes32 requestData; // keccak256 hash of the data that the requester wants to be resolved
        uint256 requestedTime;
        uint256 reward;
        uint256 bondSize;
        uint256 liveness;
        // Proposer data
        bytes32 proposerAnswer; // an answer was proposed if != 0
        bytes proposerPubkey;
        uint256 proposalTime;
        // Disputer data
        bytes32 disputerAnswer;
        bytes disputerPubkey;
        uint256 votingStartTime;
        uint256[3] votes; // index 0 is in favor of proposer, index 1 is in favor of the disputer, index 2 is cant resolver
        mapping(address => uint256) votersCollateral; // tracking the amount of eth deposited by voters
        // Settlement data
        uint256 settlementTime;
        bytes32 finalAnswer;
    }

    /// @notice Format for proposals
    struct Proposal {
        uint256 requestId;
        bytes32 answer;
    }

    /// @notice Format for disputes
    struct Dispute {
        uint256 requestId;
        bytes32 answer;
    }

    /// @notice We standarize the voting period across requests (so that voters can vote on multiple
    /// requests at once without the concern of different voting period lengths)
    uint256 votingPeriod = 24 hours;

    /// @notice The percentage of the slashed amount that is given as a reward to the opposite party
    uint256 rewardedSlashAmount = 1e18 / 2;

    /// @notice The percentage of the reward that is given to the party that settles the request. 
    /// The rest is given to whomever won
    uint256 settlerReward;

    /// @notice The restaking controller contract
    RestakingController restakingController;

    /// @notice Storage list for all created requests
    Request[] requests;

    /*//////////////////////////////////////////////////////////////
                                Errors
    //////////////////////////////////////////////////////////////*/

    error VotingIsOver(uint256 requestId);
    error VotingNotOver(uint256 requestId);

    error RequestAlreadyProposed(uint256 requestId);
    error RequestAlreadySettled(uint256 requestId);
    error RequestAlreadyDisputed(uint256 requestId);

    error RequestNotSettled(uint256 requestId);
    error RequestNotProposed(uint256 requestId);
    error RequestNotDisputed(uint256 requestId);

    error AnswerEmpty(bytes32 answer);
    error SameAnswewr(bytes32 answer);
    error InvalidVote(uint256 vote);
    error LivenessNotOver(uint256 requestId);

    error FailedToSendEther(bytes data);

    /*//////////////////////////////////////////////////////////////
                               Modifiers
    //////////////////////////////////////////////////////////////*/

    modifier isCurrentlyVoted(uint256 requestId) {
        if (requests[requestId].votingStartTime + votingPeriod < block.timestamp) revert VotingIsOver(requestId);
        _;
    }

    modifier notEmptyAnswer(bytes32 answer) {
        if (answer == keccak256("0x0")) revert AnswerEmpty(answer);
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              Constructor
    //////////////////////////////////////////////////////////////*/

    constructor(address _restakingController) {
        restakingController = RestakingController(_restakingController);
    }

    /*//////////////////////////////////////////////////////////////
                               External
    //////////////////////////////////////////////////////////////*/

    /// @notice Make a request to the oracle.
    /// @param requestData Request data
    /// @param bondSize The amount of collateral put up for the request
    /// @param liveness The amount of time allowed to dispter the request
    function request(bytes calldata requestData, uint256 bondSize, uint256 liveness)
        external
        payable
        returns (uint256)
    {
        // We create a new request by using push function (which also increases the array length)
        // Default values for the request are set by its type
        Request storage newRequest = requests.push();
        newRequest.requestData = keccak256(requestData);
        newRequest.requestedTime = block.timestamp;
        newRequest.reward = msg.value;
        newRequest.bondSize = bondSize;
        newRequest.liveness = liveness;

        return requests.length - 1;
    }

    /// @notice Propose an answer for a request
    /// @param requestId ID of request
    /// @param pubkey Public key of the proposer
    /// @param answer Answer data
    /// @param signature Signature of the proposer
    /// @param publicKeyYCoordinate The y coordinate of the public key
    /// @param signatureYCoordinate The y coordinate of the signature
    function propose(
        uint256 requestId,
        bytes calldata pubkey,
        bytes32 answer,
        bytes calldata signature,
        DepositVerifier.Fp calldata publicKeyYCoordinate,
        DepositVerifier.Fp2 calldata signatureYCoordinate
    ) external notEmptyAnswer(answer) {
        if (isProposed(requestId)) revert RequestAlreadyProposed(requestId);

        // We use sha256 to maintain consistency with the restaking controller
        bytes32 ancillaryData = sha256(abi.encode(sha256("Proposal(uint256,bytes32)"), requestId, answer));

        // The restaking controller contract verifies the signature for us
        restakingController.restake(
            address(this),
            pubkey,
            requests[requestId].bondSize,
            ancillaryData,
            signature,
            publicKeyYCoordinate,
            signatureYCoordinate
        );

        // We set the proposer's answer and pubkey in the request
        requests[requestId].proposerAnswer = answer;
        requests[requestId].proposerPubkey = pubkey;
        requests[requestId].proposalTime = block.timestamp;
    }

    /// @notice Settle a request
    /// @param requestId ID of request
    function settle(uint256 requestId) external {
        if (isSettled(requestId)) revert RequestAlreadySettled(requestId);

        if (isDisputed(requestId)) {
            if (!isVoteOver(requestId)) revert VotingNotOver(requestId);

            uint256 voteResult = getVoteResult(requestId);

            if (voteResult == 0) {
                // vote result: YES
                _rewardAndSlash(requestId, false);
                requests[requestId].finalAnswer = requests[requestId].proposerAnswer;
            } else if (voteResult == 1) {
                // vote result: NO
                _rewardAndSlash(requestId, true);
                requests[requestId].finalAnswer = requests[requestId].disputerAnswer;
            } else {
                // vote result: UNRESOLVED
                // TODO: what happens here?
                requests[requestId].finalAnswer = keccak256("0x1");
            }
        } else {
            if (requests[requestId].proposalTime + requests[requestId].liveness > block.timestamp) {
                revert LivenessNotOver(requestId);
            }

            requests[requestId].finalAnswer = requests[requestId].proposerAnswer;
            _rewardProposer(requestId);
        }

        requests[requestId].settlementTime = block.timestamp;
        _rewardSettler(requestId);
    }

    /// @notice Dispute the proposed answer for a request
    /// @param requestId ID of request
    /// @param pubkey Public key of the disputer
    /// @param answer Answer data
    /// @param signature Signature of the disputer
    /// @param publicKeyYCoordinate The y coordinate of the public key
    /// @param signatureYCoordinate The y coordinate of the signature
    function dispute(
        uint256 requestId,
        bytes calldata pubkey,
        bytes32 answer,
        bytes calldata signature,
        DepositVerifier.Fp calldata publicKeyYCoordinate,
        DepositVerifier.Fp2 calldata signatureYCoordinate
    ) external notEmptyAnswer(answer) {
        if (isDisputed(requestId)) revert RequestAlreadyDisputed(requestId);
        if (answer == requests[requestId].proposerAnswer) revert SameAnswewr(answer);

        bytes32 ancillaryData = keccak256(abi.encode(keccak256("Dispute(uint256,bytes32)"), requestId, answer));

        // Set up bond
        restakingController.restake(
            address(this),
            pubkey,
            requests[requestId].bondSize,
            ancillaryData,
            signature,
            publicKeyYCoordinate,
            signatureYCoordinate
        );

        // Trigger voting
        requests[requestId].disputerAnswer = answer;
        requests[requestId].disputerPubkey = pubkey;
        requests[requestId].votingStartTime = block.timestamp;
    }

    /// @notice Vote for an ongoing dispute
    /// @param requestId ID of request
    /// @param _vote Vote type | 0: NO, 1: YES, 2: UNRESOLVED
    function vote(uint256 requestId, uint256 _vote) external payable {
        if (isVoteOver(requestId)) revert VotingIsOver(requestId);

        // Sanity check for the variable vote
        if (_vote > 2) revert InvalidVote(_vote);

        // no need to use BLS pubkey since there's no restaking/slashing involved here
        requests[requestId].votersCollateral[msg.sender] += msg.value;
        requests[requestId].votes[_vote] += msg.value;
    }

    /// @notice Return the vote collateral
    /// @param requestId ID of request
    /// @param to Receiver of collateral
    function returnVoteCollateral(uint256 requestId, address payable to) external returns (uint256 collateralAmount) {
        if (!isSettled(requestId)) revert RequestNotSettled(requestId);

        collateralAmount = requests[requestId].votersCollateral[msg.sender];

        requests[requestId].votersCollateral[msg.sender] = 0;

        (bool sent, bytes memory data) = to.call{value: collateralAmount}("");
        if (!sent) revert FailedToSendEther(data);
    }

    /*//////////////////////////////////////////////////////////////
                                 View
    //////////////////////////////////////////////////////////////*/

    /// @dev Return true if a request has been proposed
    /// @param requestId ID of request
    function isProposed(uint256 requestId) public view returns (bool) {
        return requests[requestId].proposerAnswer != 0;
    }

    /// @dev Return true if a request has been disputed
    /// @param requestId ID of request
    function isDisputed(uint256 requestId) public view returns (bool) {
        if (!isProposed(requestId)) revert RequestNotProposed(requestId);
        return requests[requestId].disputerAnswer != 0;
    }

    /// @dev Return true if vote is over
    /// @param requestId ID of request
    function isVoteOver(uint256 requestId) public view returns (bool) {
        if (!isDisputed(requestId)) revert RequestNotDisputed(requestId);
        return block.timestamp > requests[requestId].votingStartTime + votingPeriod;
    }

    /// @dev Return true if a request has been disputed
    /// @param requestId ID of request
    function isSettled(uint256 requestId) public view returns (bool) {
        if (!isProposed(requestId)) revert RequestNotProposed(requestId);
        return requests[requestId].finalAnswer != 0;
    }

    /// @dev Get vote results of request
    /// @param requestId ID of request
    function getVoteResult(uint256 requestId) public view returns (uint256) {
        if (
            requests[requestId].votes[0] > requests[requestId].votes[1]
                && requests[requestId].votes[0] > requests[requestId].votes[2]
        ) {
            return 0;
        }

        if (
            requests[requestId].votes[1] > requests[requestId].votes[0]
                && requests[requestId].votes[1] > requests[requestId].votes[2]
        ) {
            return 1;
        }

        return 2;
    }

    /*//////////////////////////////////////////////////////////////
                                Internal
    //////////////////////////////////////////////////////////////*/

    /// @dev Reward the settler
    /// @param requestId ID of request
    function _rewardSettler(uint256 requestId) internal {
        (bool sent, bytes memory data) = payable(msg.sender).call{value: requests[requestId].reward * settlerReward}("");
        if (!sent) revert FailedToSendEther(data);
    }

    /// @dev Reward the proposer
    /// @param requestId ID of request
    function _rewardProposer(uint256 requestId) internal {
        restakingController.unrestake(
            address(this), requests[requestId].proposerPubkey, requests[requestId].bondSize + requests[requestId].reward
        );

        // NOTE: can this function silently fail?
        restakingController.rewardWithETH{value: requests[requestId].reward * (1 - settlerReward)}(
            requests[requestId].proposerPubkey
        );
    }

    /// @dev Reward and slash
    /// @param requestId ID of request
    /// @param punishProposer True if the proposer should be slashed
    function _rewardAndSlash(uint256 requestId, bool punishProposer) internal {
        bytes memory pubkeyPunish =
            punishProposer ? requests[requestId].proposerPubkey : requests[requestId].disputerPubkey;
        bytes memory pubkeyReward =
            punishProposer ? requests[requestId].disputerPubkey : requests[requestId].proposerPubkey;

        restakingController.slash(
            address(this), pubkeyPunish, requests[requestId].bondSize * (1e18 - rewardedSlashAmount)
        );
        restakingController.slashAndReward(
            address(this), pubkeyPunish, pubkeyReward, requests[requestId].bondSize * rewardedSlashAmount
        );
        // and return the bond to the winner
        restakingController.unrestake(address(this), pubkeyReward, requests[requestId].bondSize);
    }
}
