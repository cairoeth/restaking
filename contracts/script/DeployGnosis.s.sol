// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {DeployBase} from "./DeployBase.s.sol";

contract DeployGnosis is DeployBase {
    address public immutable _controller = 0x94E9b8A9bf9C7d8e8A3AF85A387b1CbFf2a47884;

    constructor() DeployBase(_controller) {}
}
