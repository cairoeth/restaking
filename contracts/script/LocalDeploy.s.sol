// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "@restaking/RestakingController.sol";
import {MockToken} from "../test/utils/MockToken.sol";

contract LocalDeploy is Script {
    RestakingController internal controller;
    MockToken internal underlyingToken;

    uint256 internal deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address internal deployerAddress = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);

    function run() external {
        vm.startBroadcast(deployerPrivateKey);

        controller = new RestakingController();
        underlyingToken = new MockToken();

        vm.stopBroadcast();
    }
}
