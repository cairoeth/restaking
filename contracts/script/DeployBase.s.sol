// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import "forge-std/Script.sol";

import {RestakingController} from "@restaking/RestakingController.sol";
import {BasicModule} from "@restaking/modules/examples/BasicModule.sol";

import {MockToken} from "../test/utils/MockToken.sol";

abstract contract DeployBase is Script {
    // Contracts.
    RestakingController internal controller;
    MockToken internal underlyingToken;

    constructor(address _controller) {
        controller = RestakingController(_controller);
    }

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        underlyingToken = new MockToken();
        address wrapper = controller.createWrapper(address(underlyingToken));

        BasicModule moduleOracle = new BasicModule(
            "Optimistic Oracle",
            "https://cdn.icon-icons.com/icons2/1465/PNG/512/744crystalball2_100483.png"
        );
        BasicModule moduleOptimism = new BasicModule(
            "Optimistic L2",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mr._Smiley_Face.svg/1200px-Mr._Smiley_Face.svg.png"
        );
        BasicModule moduleL3 = new BasicModule(
            "Layer 3",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDREXJTcHF4VLzzQDaQ-5TCRaqlpk5VsHsmZC266IqbWqRS8FdrxkqCssMnjNsQHy5tWE&usqp=CAU"
        );

        moduleOracle.addWrapper(wrapper);
        moduleOptimism.addWrapper(wrapper);
        moduleL3.addWrapper(wrapper);

        controller.addModule(address(moduleOracle));
        controller.addModule(address(moduleOptimism));
        controller.addModule(address(moduleL3));

        vm.stopBroadcast();
    }
}
