// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

interface ModuleBase {
    function name() external view returns (string calldata); // name of module

    function image() external view returns (string calldata); // image of the module

    function getWrappers() external view returns (address[] memory); // wrappers that the module supports

    function getMaxSlashPcts() external view returns (uint256[] memory); // max percentage that can be slashed by the module (1e18 = 100%) for each token

    function getLockAmount(address wrapper) external view returns (uint256); // get the amount of wrapped tokens to be locked when restaked

    function supportsInterface(bytes4 interfaceId) external pure returns (bool); // ERC-165 interface check

    function supportsWrapper(address wrapper) external view returns (bool); // check if the module supports a wrapper
}
