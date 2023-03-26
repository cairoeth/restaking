// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

/// @title Restaking Token
/// @author cairoeth
/// @author 0xfuturistic
contract rsToken is ERC20 {
    using SafeTransferLib for ERC20;

    /*//////////////////////////////////////////////////////////////
                                Variables
    //////////////////////////////////////////////////////////////*/

    /// @notice Underlying wrapped token address.
    address public immutable wrapped;

    /// @notice Controller address.
    address public immutable controller;

    /// @notice The amount of tokens restaked into a module by an address
    mapping(address => mapping(address => uint256)) public restakedAmount;

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
    constructor(string memory name, string memory symbol, uint8 decimals, address token, address _controller)
        ERC20(name, symbol, decimals)
    {
        wrapped = token;
        controller = _controller;
    }

    /*//////////////////////////////////////////////////////////////
                             RESTAKING LOGIC
    //////////////////////////////////////////////////////////////*/

    // TODO: add 'from' arg
    function restake(address module, uint256 amount) public returns (bool) {
        restakedAmount[msg.sender][module] = amount;

        //emit Restake(msg.sender, module, amount);

        return true;
    }

    // we override the default transferFrom function for restaking
    // note: for restaking tokens, the allowance is not considered. only the restaked amount
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

        return true;
    }

    // TODO: add 'too' arg
    function deposit(uint256 amount) public returns (bool) {
        ERC20(wrapped).safeTransferFrom(msg.sender, address(this), amount);

        _mint(msg.sender, amount);

        //emit Deposit(msg.sender, amount);

        return true;
    }

    // TODO: add 'too' arg
    function withdraw(uint256 amount) public returns (bool) {
        if (balanceOf[msg.sender] < amount) revert Insufficient();

        _burn(msg.sender, amount);
        ERC20(wrapped).safeTransferFrom(address(this), msg.sender, amount);

        //emit withdraw(msg.sender, amount);

        return true;
    }

    // TODO: add lock function
}
