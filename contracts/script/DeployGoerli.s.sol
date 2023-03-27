// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {DeployBase} from "./DeployBase.s.sol";

contract DeployGoerli is DeployBase {
    address public immutable _controller = 0xa0C21F3f1359f45890f918CFd340361CcD91627B;

    constructor() DeployBase(_controller) {}
}
