// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

interface Module {
    function updateCallback(address user, uint256 amount) external;
}

/// @title Restaking Token
/// @author cairoeth
/// @author 0xfuturistic
contract rsToken is ERC20 {
    using SafeTransferLib for ERC20;

    /*//////////////////////////////////////////////////////////////
                                VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Underlying wrapped token address.
    address public immutable wrapped;

    /// @notice Controller address.
    address public immutable controller;

    /// @notice The amount of tokens restaked into a module by an address
    mapping(address => mapping(address => uint256)) public restakedAmount;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed sender, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error Unauthorized();
    error Insufficient();

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

    /// @notice Helper function to restake and deposit in a single transaction
    /// @param module The address of the module.
    /// @param amount The amount of tokens to restake.
    function depositAndRestake(
        address module,
        uint256 amount
    ) public returns (bool) {
        deposit(amount);
        restake(module, amount);

        return true;
    }

    /// @notice Helper function to unrestake and withdraw in a single transaction
    /// @param module The address of the module.
    /// @param amount The amount of tokens to unrestake.
    function unrestakeAndWithdraw(
        address module,
        uint256 amount
    ) public returns (bool) {
        restake(module, 0);
        withdraw(amount);

        return true;
    }

    /// @notice We override the default transferFrom function for restaking
    ///         for restaking tokens, the allowance is not considered. only the restaked amount
    /// @param from The address to transfer from.
    /// @param to The address to transfer to.
    /// @param amount The amount of tokens to transfer.
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(restakedAmount[from][msg.sender] >= amount, "RestakingToken: insufficient restaked amount");

        // note: unlike allowance, the restaked amount doesn't decrease
        //if (allowed != type(uint256).max) allowance[from][msg.sender] = allowed - amount;

        balanceOf[from] -= amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += amount;
        }

        emit Transfer(from, to, amount);
        Module(msg.sender).updateCallback(from, amount);

        return true;
    }

    /// @notice Restakes tokens into a module.
    /// @param module The address of the module.
    /// @param amount The amount of tokens to restake.
    function restake(address module, uint256 amount) public {
        restakedAmount[msg.sender][module] = amount;
        // Module(module).updateCallback(msg.sender, amount);
    }

    /// @notice Wrap token with wrapper.
    /// @param amount The amount of tokens to wrap.
    function deposit(uint256 amount) public {
        ERC20(wrapped).safeTransferFrom(msg.sender, address(this), amount);

        _mint(msg.sender, amount);

        emit Deposit(msg.sender, amount);
    }

    /// @notice Unwrap token with wrapper.
    /// @param amount The amount of tokens to unwrap.
    function withdraw(uint256 amount) public {
        if (balanceOf[msg.sender] < amount) revert Insufficient();

        _burn(msg.sender, amount);
        ERC20(wrapped).safeTransferFrom(address(this), msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /// @notice Returns the lockable amount of tokens.
    /// @param user The address of the restaker.
    /// @param module The address of the module.
    function getLockableAmount(address user, address module) public view returns (uint256) {
        if (restakedAmount[user][module] >= balanceOf[user]) {
            return balanceOf[user];
        } else {
            return restakedAmount[user][module];
        }
    }
}
