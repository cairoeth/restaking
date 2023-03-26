// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

/// @title Restaking Token
/// @author cairoeth
/// @author 0xfuturistic
/// @notice Token wrapper that allows to restake.
contract rsToken is ERC20 {
    using SafeTransferLib for ERC20;

    /*//////////////////////////////////////////////////////////////
                                ADDRESSES
    //////////////////////////////////////////////////////////////*/

    /// @notice Underlying wrapped token address.
    address public immutable wrapped;

    /// @notice Controller address.
    address public immutable controller;

    /// @notice The amount of tokens assigned to a module by a given restaker.
    mapping(address => mapping(address => uint256)) public assignedBalance;

    /// @notice The amount of tokens locked by to a module by a given restaker.
    mapping(address => mapping(address => uint256)) public lockedBalance;

    /// @notice Store the unlocked balance of restakers.
    mapping(address => uint256) public unlockedBalance;

    /// @notice Store the locked balance of restakers.
    mapping(address => uint256) public lockedBalance;

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error Unauthorized();
    error Insufficient();

    /*//////////////////////////////////////////////////////////////
                                Modifiers
    //////////////////////////////////////////////////////////////*/

    modifier onlyController() {
        if (msg.sender != controller) revert Unauthorized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Sets the ERC20 token data.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param decimals The number of decimals of the token.
    /// @param token The address of the underlying wrapped token.
    /// @param token The controller address.
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address token,
        address _controller
    ) ERC20(name, symbol, decimals) {
        wrapped = token;
        controller = _controller;
    }

    /*//////////////////////////////////////////////////////////////
                             RESTAKING LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Mint restaking token
    /// @param receiver The address to receive the restaking token (restaker).
    /// @param amount The amount to mint.
    function deposit(address receiver, uint256 amount) external {
        ERC20(wrapped).safeTransferFrom(receiver, address(this), amount);
        _mint(receiver, amount);

        // unlockedBalance[restaker] += amount;
    }

    /// @notice Withdraw underlying token by burning the restaking token.
    /// @param restaker The restaker address
    /// @param amount The amount to withdraw.
    function withdraw(address restaker, uint256 amount) external {
        // if (amount > unlockedBalance[restaker]) revert Insufficient();

        _burn(restaker, amount);
        ERC20(wrapped).safeTransfer(restaker, amount);

        // unlockedBalance[restaker] -= amount;
    }

    // /// @notice Set the unlocked and locked balances of a restaker.
    // /// @param amount The amount of tokens to lock.
    // function lock(address restaker, uint256 amount) external onlyController {
    //     unlockedBalance[restaker] -= amount;
    //     lockedBalance[restaker] += amount;

    //     if ((unlockedBalance[restaker] + lockedBalance[restaker]) != balanceOf(restaker)) revert Insufficient();
    // }

    // /// @notice Assigns a given amount of wrapper tokens to a module.
    // /// @param restaker The restaker address
    // /// @param module The address of the module.
    // /// @param amount The amount to withdraw.
    // function assign(address restaker, address module, uint256 amount) public virtual returns (bool) {
    //     allowance[msg.sender][spender] += amount;

    //     emit Approval(msg.sender, spender, amount);

    //     return true;
    // }
}
