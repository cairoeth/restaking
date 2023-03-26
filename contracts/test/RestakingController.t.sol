// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.15;

import "forge-std/Test.sol";

import "@restaking/RestakingController.sol";
import "@restaking/RestakingToken.sol";
import {BasicModule} from "@restaking/modules/examples/BasicModule.sol";

import {ERC20} from "@solmate/tokens/ERC20.sol";

import {Utils} from "./utils/Utils.sol";
import {MockToken} from "./utils/MockToken.sol";

contract TestRestakingController is Test {
    Utils internal utils;

    /*//////////////////////////////////////////////////////////////
                                CONTRACTS
    //////////////////////////////////////////////////////////////*/

    MockToken internal underlyingToken;
    RestakingController internal controller;

    /*//////////////////////////////////////////////////////////////
                                  USERS
    //////////////////////////////////////////////////////////////*/

    address internal USER;
    address internal MODULE_ADMIN;
    address internal DEPLOYER;

    /*//////////////////////////////////////////////////////////////
                                 SET UP
    //////////////////////////////////////////////////////////////*/

    function setUp() public {
        utils = new Utils();
        address payable[] memory users = utils.createUsers(3);

        USER = users[0];
        vm.label(USER, "User");

        MODULE_ADMIN = users[1];
        vm.label(MODULE_ADMIN, "Module Admin");

        DEPLOYER = users[1];
        vm.label(DEPLOYER, "Deployer");

        vm.prank(MODULE_ADMIN);
        underlyingToken = new MockToken();
        vm.label(address(underlyingToken), "Underlying Token");

        underlyingToken.mint(USER, 1000 ether);

        vm.prank(DEPLOYER);
        controller = new RestakingController();
    }

    /// @dev Check that token can be wrapped into rsToken through the controller.
    function testWrapperCreation() public {
        vm.startPrank(USER);

        address wrapper = controller.createWrapper(address(underlyingToken));

        vm.expectRevert();
        controller.createWrapper(address(underlyingToken));

        assertTrue(controller.tokenToWrapper(address(underlyingToken)) == wrapper);
    }

    /// @dev Check that module can be added to the controller if it follows the interface.
    function testAddModule() public {
        vm.startPrank(USER);

        address module = address(new BasicModule('Basic Module', 'https://example.com/image.png'));
        controller.addModule(module);

        vm.expectRevert();
        controller.addModule(address(0));

        assertTrue(controller.modules(0) == module);
    }
}
