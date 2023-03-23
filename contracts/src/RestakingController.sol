// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {FixedPointMathLib} from "@solmate/utils/FixedPointMathLib.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC165Checker} from "@openzeppelin/utils/introspection/ERC165Checker.sol";
import {rsToken} from "@restaking/RestakingToken.sol";
import {IModule} from "@restaking/modules/IModule.sol";

/// @title Restaking Controller
/// @author cairoeth
/// @author 0xfuturistic
/// @notice Controller to restake tokens, manage modules, and slashings.
contract RestakingController {
    using ERC165Checker for address;

    /*//////////////////////////////////////////////////////////////
                                VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @dev Constant string identifier to concatenate with the token name.
    string public constant prefix = "rs";

    /// @dev Constant interface identifier to check with ERC-165.
    bytes4 public constant interfaceId = 0x20965255;

    /// @dev Store of all tokens created by this controller.
    address[] public wrappers;

    /// @dev Store the modules.
    address[] public modules;

    /// @dev Store the index of the modules.
    mapping(address => uint256) public moduleIndex;

    /// @dev Store the wrapper addresses for ERC20 tokens.
    mapping(address => address) public tokenToWrapper;

    /// @dev Store the addresses that added modules.
    mapping(address => address) public admin;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event WrapperCreated(address indexed token, address indexed wrapper);
    event ModuleAdded(address indexed module);
    event ModuleRemoved(address indexed module);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error ModuleUnexistant(address module);
    error WrapperExisting(address token);
    error Unauthorized(address admin);
    error Unsupported(address module);

    /*//////////////////////////////////////////////////////////////
                             PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Create a pool with the given parameters.
    /// @param token ERC20 token to wrap around.
    function createWrapper(ERC20 token) public returns (address wrapper) {
        address _token = address(token);
        if (tokenToWrapper[_token] != address(0))
            revert WrapperExisting(_token);

        // Create wrapper and save its address
        wrapper = address(
            new rsToken(
                string.concat(prefix, token.name()),
                string.concat(prefix, token.symbol()),
                token.decimals(),
                _token
            )
        );

        wrappers.push(wrapper);
        tokenToWrapper[_token] = wrapper;

        emit WrapperCreated(_token, wrapper);
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restake a given amount of tokens to a module.
    /// @param token ERC20 token to restake.
    /// @param amount Amount of tokens to restake.
    /// @param module Module to restake to.
    function restake(address token, uint256 amount, address module) external {
        if (moduleIndex[module] == 0) revert ModuleUnexistant(module);
        if (tokenToWrapper[token] == address(0)) {
            address wrapper = createWrapper(ERC20(token));
        } else {
            address wrapper = tokenToWrapper[token];
        }

        rsToken(wrapper).deposit(amount);

        // todo: check that module exists
        // todo: check that token wrapper is created, if not, create it
        // deposit tokens to the wrapper
        // assign restaked tokens to the module
    }

    /// @notice Restake multiple tokens to a module.
    /// @param tokens ERC20 tokens to restake.
    /// @param amounts Amounts of tokens to restake.
    /// @param module Module to restake to.
    function restakeMultiple(
        address[] tokens,
        uint256[] amounts,
        address module
    ) external {
        // todo: check that module exists
        // todo: check that token wrapper is created
        // deposit tokens to the wrapper
        // assign restaked tokens to the module
    }

    /// @notice Unstake tokens from a module.
    /// @param tokens ERC20 token to unstake.
    /// @param amount Amount to unstake.
    /// @param module Module to unstake from.
    function unstake(address token, uint256 amount, address module) external {
        // todo: check that module exists
        // todo: check that token wrapper is created
        // todo: make sure that the user cannot unstake during liveness or disputations
        // unstake tokens from the module and withdraw to receive the underlying
    }

    /// @notice Add a module to the directory.
    /// @dev Must follow the module interface.
    /// @param module Module address.
    function addModule(address module) external {
        if (!IModule(module).supportsInterface(interfaceId))
            revert Unsupported(module);

        modules.push(module);
        moduleIndex[module] = modules.length - 1;
        admin[module] = msg.sender;

        emit ModuleAdded(module);
    }

    /// @notice Remove a module from the directory.
    /// @dev Must be the same address that added the module to the directory.
    /// @param module Module address.
    function removeModule(address module) external {
        if (admin[module] != msg.sender) revert Unauthorized(admin[module]);

        delete modules[moduleIndex[module]];
        delete moduleIndex[module];
        delete admin[module];

        emit ModuleRemoved(module);
    }
}
