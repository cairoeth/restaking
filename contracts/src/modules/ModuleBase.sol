// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

interface ModuleBase {
    function name() external view returns (string calldata); // name of module

    function image() external view returns (string calldata); // image of the module

    function getTokens() external view returns (address[] memory); // tokens that the module supports

    function getMinStakes() external view returns (uint256[] memory); // min amount that can be staked in the module for each supported token

    function getMaxSlashPcts() external view returns (uint256[] memory); // max percentage that can be slashed by the module (1e18 = 100%) for each token

    function supportsInterface(bytes4 interfaceId) external pure returns (bool); // ERC-165 interface check
}
