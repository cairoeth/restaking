// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import "@restaking/RestakingController.sol";

import {MockToken} from "../test/utils/MockToken.sol";

contract GoerliDeploy is Script {
    RestakingController internal controller;
    MockToken internal underlyingToken;

    function setUp() public {}

    function run() public {
        string memory seedPhrase = vm.readFile(".secret");
        uint256 privateKey = vm.deriveKey(seedPhrase, 0);
        // address DEPLOYER = vm.rememberKey(privateKey);

        vm.startBroadcast(privateKey);

        controller = new RestakingController();
        underlyingToken = new MockToken();

        vm.stopBroadcast();
    }
}
