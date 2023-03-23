// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {FixedPointMathLib} from "@solmate/utils/FixedPointMathLib.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {rsToken} from "@restaking/RestakingToken.sol";

/// @title Restaking Controller
/// @author cairoeth
/// @author 0xfuturistic
/// @notice Controller to restake tokens, manage modules, and slashings.
contract RestakingController {

    /*//////////////////////////////////////////////////////////////
                                VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @dev Constant string identifier to concatenate with the token name.
    string public constant prefix = "rs";

    /// @dev Store of all tokens created by this controller.
    address[] public wrappers;

    /// @dev Store the wrapper addresses for ERC20 tokens.
    mapping(address => address) public wrapperToToken;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event WrapperCreated(address indexed token, address indexed wrapper);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error WrapperExisting(address token);

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Create a pool with the given parameters.
    /// @param token ERC20 token to wrap around.
    function createWrapper(ERC20 token) external {
        address _token = address(token);
        if (wrappers[_token] != address(0)) revert WrapperExisting(_token);

        // Create wrapper and save its address
        address wrapper = address(new rsToken(string.concat(prefix, ERC20.name()), string.concat(prefix, ERC20.symbol()), ERC20.decimals()));
        wrappers.push(wrapper);
        wrapperToToken[_token] = wrapper;

        emit WrapperCreated(_token, wrapper);
    }


}
