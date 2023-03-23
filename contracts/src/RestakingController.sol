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
    mapping(address => address) public wrapperToToken;

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

    error WrapperExisting(address token);
    error Unauthorized(address admin);
    error Unsupported(address module);

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Create a pool with the given parameters.
    /// @param token ERC20 token to wrap around.
    function createWrapper(ERC20 token) external {
        address _token = address(token);
        if (wrapperToToken[_token] != address(0)) revert WrapperExisting(_token);

        // Create wrapper and save its address
        address wrapper = address(new rsToken(
            string.concat(prefix, token.name()), 
            string.concat(prefix, token.symbol()), 
            token.decimals(),
            _token
        ));

        wrappers.push(wrapper);
        wrapperToToken[_token] = wrapper;

        emit WrapperCreated(_token, wrapper);
    }

    /// @notice Add a module to the directory.
    /// @dev Must follow the module interface.
    /// @param module Module address.
    function addModule(address module) external {
        if (!IModule(module).supportsInterface(interfaceId)) revert Unsupported(module);

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
