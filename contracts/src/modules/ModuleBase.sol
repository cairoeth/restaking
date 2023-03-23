// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

abstract contract ModuleBase {
    function getMinStake() external view virtual returns (uint256); // min amount that can be staked in the module

    function getMaxSlashPct() external view virtual returns (uint256); // max percentage that can be slashed by the module (1e18 = 100%) (a security check)
}
