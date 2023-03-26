// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {DeployBase} from "./DeployBase.s.sol";

contract DeployLocal is DeployBase {
    constructor() DeployBase() {}
}
