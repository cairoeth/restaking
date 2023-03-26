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

    /// @dev Store the wrapper addresses for ERC20 tokens.
    mapping(address => address) public tokenToWrapper;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event WrapperCreated(address indexed token, address indexed wrapper);
    event ModuleAdded(address indexed module);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error WrapperExisting(address token);
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
                token,
                address(this)
            )
        );

        wrappers.push(wrapper);
        tokenToWrapper[token] = wrapper;

        emit WrapperCreated(token, wrapper);
    }

    /// @notice Return the corresponding wrapper of a token.
    /// @param token Address of ERC20 token.
    function getWrapper(address token) public returns (address wrapper) {
        if (tokenToWrapper[token] == address(0)) {
            return createWrapper(token);
        } else {
            return tokenToWrapper[token];
        }
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Fetch the corresponding wrapper of a token and deposit.
    /// @param token The address of the token.
    /// @param amount The amount of tokens to deposit.
    function deposit(address token, uint256 amount) external {
        address wrapper = getWrapper(token);

        rsToken(wrapper).deposit(amount);
    }

    /// @notice Fetch the corresponding wrapper of a token and withdraw.
    /// @param token The address of the token.
    /// @param amount The amount of tokens to withdraw.
    function withdraw(address token, uint256 amount) external {
        address wrapper = getWrapper(token);

        rsToken(wrapper).withdraw(amount);
    }

    /// @notice Fetch the corresponding wrapper of a token and restake to a module.
    /// @param token The address of the token.
    /// @param module The address of the module to restake to
    /// @param amount The amount of tokens to restake.
    function restake(address token, address module, uint256 amount) external {
        address wrapper = getWrapper(token);

        rsToken(wrapper).restake(wrapper, amount);
    }

    /// @notice TransferFrom modification to fit restaking of wrapper.
    /// @param token The address of the token to transfer.
    /// @param from The address to transfer from.
    /// @param to The address to transfer to.
    function transferFrom(address token, address from, address to, uint256 amount) external {
        address wrapper = getWrapper(token);

        rsToken(wrapper).transferFrom(from, to, amount);
    }

    /// @notice Add a module to the directory to show up in UI.
    /// @param module The address of the module.
    function addModule(address module) external {
        if (!ModuleBase(module).supportsInterface(interfaceId)) {
            revert Unsupported(module);
        }

        modules.push(module);

        emit ModuleAdded(module);
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns all the created wrappers.
    function allWrappers() public view returns (address[] memory) {
        address[] memory w = new address[](wrappers.length);

        for (uint256 i = 0; i < wrappers.length; i++) {
            w[i] = wrappers[i];
        }

        return w;
    }

    /// @notice Returns all the added modules.
    function allModules() public view returns (address[] memory) {
        address[] memory m = new address[](modules.length);

        for (uint256 i = 0; i < modules.length; i++) {
            m[i] = modules[i];
        }

        return m;
    }
}
