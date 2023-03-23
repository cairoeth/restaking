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

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error Unauthorized();

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @notice Sets the ERC20 token data.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param decimals The number of decimals of the token.
    /// @param token THe address of the underlying wrapped token.
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address token
    ) ERC20(name, symbol, decimals) {
        wrapped = token;
    }

    /*//////////////////////////////////////////////////////////////
                             RESTAKING LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Mint restaking token
    /// @param receiver The address to receive the restaking token.
    /// @param amount The amount to mint.
    function deposit(address receiver, uint256 amount) external {
        ERC20(wrapped).safeTransferFrom(receiver, address(this), amount);
        _mint(receiver, amount);
    }

    /// @notice Withdraw underlying token by burning the restaking token.
    /// @param amount The amount to withdraw.
    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        ERC20(wrapped).safeTransfer(msg.sender, amount);
    }
}
