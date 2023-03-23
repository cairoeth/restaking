// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import "@restaking/RestakingController.sol";

import {MockToken} from "../test/utils/MockToken.sol";

contract SearchScript is Script {
    function setUp() public {}

    function run() public {
        string memory seedPhrase = vm.readFile(".secret");
        uint256 privateKey = vm.deriveKey(seedPhrase, 0);
        address DAO = vm.rememberKey(privateKey);

        vm.startBroadcast(privateKey);

        controller = new RestakingController();
        underlyingToken = new MockToken();

        vm.stopBroadcast();
    }
}
