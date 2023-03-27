// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {DeployBase} from "./DeployBase.s.sol";

contract DeployOptimism is DeployBase {
    address public immutable _controller = address(0);

    constructor() DeployBase(_controller) {}
}
