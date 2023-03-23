// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IModule {
    function getMinStake() external view returns (uint256); // min amount that can be staked in the module

    function getMaxSlashPct() external view returns (uint256); // max percentage that can be slashed by the module (1e18 = 100%) (a security check)
}