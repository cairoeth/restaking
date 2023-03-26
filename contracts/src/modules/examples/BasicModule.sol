// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {ModuleBase} from "@restaking/modules/ModuleBase.sol";

/// @title Basic Module
/// @author cairoeth
/// @notice A basic module that implements the correct interface to be restaking compatible.
contract BasicModule is ModuleBase {
    string public name;
    string public image;

    address[] public wrappers;
    uint256[] public minStakes;
    uint256[] public maxSlashPcts;

    bytes4 private constant INTERFACE_ID_INVALID = type(ModuleBase).interfaceId;

    constructor(string memory _name, string memory _image) {
        name = _name;
        image = _image;
    }

    function addWrapper(address wrapper) external {
        wrappers.push(wrapper);
    }

    function getWrappers() external view returns (address[] memory) {
        address[] memory w = new address[](wrappers.length);

        for (uint256 i = 0; i < wrappers.length; i++) {
            w[i] = wrappers[i];
        }

        return w;
    }

    function getLockAmount(address wrapper) external view returns (uint256) {
        return 1 ether;
    }

    function getMaxSlashPcts() external view returns (uint256[] memory) {
        uint256[] memory p = new uint256[](maxSlashPcts.length);

        for (uint256 i = 0; i < maxSlashPcts.length; i++) {
            p[i] = maxSlashPcts[i];
        }

        return p;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return interfaceId == INTERFACE_ID_INVALID;
    }

    function supportsWrapper(address wrapper) external pure returns (bool) {
        return true;
    }
}
