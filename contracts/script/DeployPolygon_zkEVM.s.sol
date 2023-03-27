// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {DeployBase} from "./DeployBase.s.sol";

contract DeployPolygon_zkEVM is DeployBase {
    address public immutable _controller = 0xb76633e091B70b41Fbc7c1D865Fa20bC41B242A3;

    constructor() DeployBase(_controller) {}
}
