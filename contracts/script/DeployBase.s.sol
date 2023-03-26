// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import {RestakingController} from "@restaking/RestakingController.sol";
import {BasicModule} from "@restaking/modules/examples/BasicModule.sol";

import {MockToken} from "../test/utils/MockToken.sol";

abstract contract DeployBase is Script {
    // Deploy addresses.
    RestakingController internal controller;
    MockToken internal underlyingToken;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // Deploy contracts
        controller = new RestakingController();
        underlyingToken = new MockToken();
        underlyingToken.mint(
            0xe7E60d2d6D7dF39810eE973Ae6187b01D4758344,
            1000 ether
        );

        address wrapper = controller.createWrapper(address(underlyingToken));

        BasicModule module = new BasicModule("Basic Module", "https://i.imgur.com/lAwEdqL.png");
        module.addWrapper(wrapper);

        new BasicModule("Basic Module 2", "https://i.imgur.com/lAwEdqL.png");
        new BasicModule("Basic Module 3", "https://i.imgur.com/lAwEdqL.png");
        new MockToken();
        vm.stopBroadcast();
    }
}
