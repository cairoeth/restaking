// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {ModuleBase} from "@restaking/modules/ModuleBase.sol";

/// @title Basic Module
/// @author cairoeth
/// @notice A basic module that implements the correct interface to be restaking compatible.
contract BasicModule is ModuleBase {
    string public name;
    string public image;

    address[] public tokens;
    uint256[] public minStakes;
    uint256[] public maxSlashPcts;

    bytes4 private constant INTERFACE_ID_INVALID = type(ModuleBase).interfaceId;

    constructor(string memory _name, string memory _image) {
        name = _name;
        image = _image;
    }

    function getTokens() external view returns (address[] memory) {
        address[] memory t = new address[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i++) {
            t[i] = tokens[i];
        }

        return t;
    }

    function getMinStakes() external view returns (uint256[] memory) {
        uint256[] memory s = new uint256[](minStakes.length);

        for (uint256 i = 0; i < minStakes.length; i++) {
            s[i] = minStakes[i];
        }

        return s;
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
}
