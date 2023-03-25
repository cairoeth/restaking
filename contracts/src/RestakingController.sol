// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {FixedPointMathLib} from "@solmate/utils/FixedPointMathLib.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC165Checker} from "@openzeppelin/utils/introspection/ERC165Checker.sol";
import {rsToken} from "@restaking/RestakingToken.sol";
import {ModuleBase} from "@restaking/modules/ModuleBase.sol";

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
    bytes4 private constant interfaceId = type(ModuleBase).interfaceId;

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
    /// @param token Address of ERC20 token to wrap around.
    function createWrapper(address token) public returns (address wrapper) {
        if (tokenToWrapper[token] != address(0)) revert WrapperExisting(token);

        ERC20 _token = ERC20(token);

        // Create wrapper and save its address
        wrapper = address(
            new rsToken(
                string.concat(prefix, _token.name()),
                string.concat(prefix, _token.symbol()),
                _token.decimals(),
                token
            )
        );

        wrappers.push(wrapper);
        tokenToWrapper[token] = wrapper;

        emit WrapperCreated(token, wrapper);
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
        address wrapper;

        if (tokenToWrapper[token] == address(0)) {
            wrapper = createWrapper(token);
        } else {
            wrapper = tokenToWrapper[token];
        }

        rsToken(wrapper).deposit(msg.sender, amount);

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
        address[] calldata tokens,
        uint256[] calldata amounts,
        address module
    ) external {
        // todo: check that module exists
        // todo: check that token wrapper is created
        // deposit tokens to the wrapper
        // assign restaked tokens to the module
    }

    /// @notice Unstake tokens from a module.
    /// @param token ERC20 token to unstake.
    /// @param amount Amount to unstake.
    /// @param module Module to unstake from.
    function unrestake(address token, uint256 amount, address module) external {
        // todo: check that module exists
        // todo: check that token wrapper is created
        // todo: make sure that the user cannot unstake during liveness or disputations
        // unstake tokens from the module and withdraw to receive the underlying
    }

    /// @notice Add a module to the directory.
    /// @dev Must follow the module interface.
    /// @param module Module address.
    function addModule(address module) external {
        if (!ModuleBase(module).supportsInterface(interfaceId))
            revert Unsupported(module);

        // TODO: add sec checks for wrapped tokens given inside the module

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

    /// @notice Returns all the created wrappers.
    function allWrappers() public view returns (address[] memory) {
        address[] memory w = new address[](wrappers.length);

        for (uint256 i = 0; i < wrappers.length; i++) {
            w[i] = wrappers[i];
        }

        return w;
    }
}
