// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {rsToken} from "@restaking/RestakingToken.sol";

/**
 * @title OptimisticL2Module
 * @notice The OptimisticL2Module contract is used to handle the PoS consensus mechanism for the Optimism L2 chain.
 */
contract OptimisticL2Module {
    rsToken public token;

    address public L2OutputOracle;

    address[] public candidateAddresses;
    uint256[] public candidateWeights;
    mapping(address => uint256) public candidateIndex;

    uint256 public minBond;
    uint256 public totalLockableAmount = 0;

    function getSequencer() external view returns (address) {
        // we calculate the index, modulo the total lockable amount
        uint256 index = block.prevrandao % totalLockableAmount;

        // finally, we find the sequencer at that index
        uint256 j = 0;
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            if (j + candidateWeights[i] >= index) {
                return candidateAddresses[i];
            }
            j += candidateWeights[i];
        }
    }

    function reward(address user) external {
        // TODO: reward the sequencer
    }

    function slash(address user) external {
        uint256 bond = candidateWeights[candidateIndex[user]];

        token.transferFrom(user, address(0), bond);
    }

    function lock(address user) external {
        uint256 bond = candidateWeights[candidateIndex[user]];

        token.transferFrom(user, address(this), bond);
    }

    function unlock(address user) external {
        uint256 bond = candidateWeights[candidateIndex[user]];

        token.transferFrom(address(this), user, bond);
    }

    function restakeCallback(address user, uint256 amount) external {
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            if (candidateAddresses[i] == user) {
                uint256 lockable = token.getLockableAmount(user, address(this));
                require(lockable >= minBond, "Not enough lockable amount for this module");

                candidateIndex[user] = i;

                totalLockableAmount -= candidateWeights[i];
                candidateWeights[i] = lockable;
                totalLockableAmount += candidateWeights[i];
            }
        }
    }
}
