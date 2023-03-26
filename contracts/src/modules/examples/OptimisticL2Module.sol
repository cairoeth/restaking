// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.18;

import {rsToken} from "@restaking/RestakingToken.sol";

/**
 * @title OptimisticL2Module
 * @notice The OptimisticL2Module contract is used to handle the PoS consensus mechanism for the Optimism L2 chain.
 */
contract OptimisticL2Module {
    /*//////////////////////////////////////////////////////////////
                                VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The rsToken wrapper of the underlying.
    rsToken public token;

    /// @notice L2OutputOracle address from the OP stack.
    address public L2OutputOracle;

    /// @notice Store the candidate addresses.
    address[] public candidateAddresses;

    /// @notice Store the candidate weights.
    uint256[] public candidateWeights;

    /// @notice Store the candidate locks.
    uint256[] public candidateLocks;

    /// @notice Store the candidate index.
    mapping(address => uint256) public candidateIndex;

    /// @notice The minimum bond required to be a candidate.
    uint256 public minBond;

    /// @notice The total lockable amount.
    uint256 public totalLockableAmount = 0;

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns the designated sequencer for the current block.
    ///         Uses the block.prevrandao and stake as weights.
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

    /// @notice Rewards a user.
    /// @param user The address of the user to reward.
    function reward(address user) external {
        require(
            msg.sender == L2OutputOracle,
            "Only the L2OutputOracle can reward"
        );

        // TODO: reward the sequencer
    }

    /// @notice Slashes a user.
    /// @param user The address of the user to slash.
    function slash(address user) external {
        require(
            msg.sender == L2OutputOracle,
            "Only the L2OutputOracle can slash"
        );

        uint256 i = candidateIndex[user];

        token.transferFrom(user, address(0), candidateLocks[i]);
    }

    /// @notice Locks a user's tokens.
    /// @param user The address of the user to lock funds from.
    function lock(address user) external {
        require(
            msg.sender == L2OutputOracle,
            "Only the L2OutputOracle can lock"
        );

        uint256 i = candidateIndex[user];

        require(token.transferFrom(user, address(this), candidateWeights[i]));

        candidateLocks[i] += candidateWeights[i];
    }

    /// @notice Unlocks a user's tokens.
    /// @param user The address of the user to unlock funds from.
    function unlock(address user) external {
        require(
            msg.sender == L2OutputOracle,
            "Only the L2OutputOracle can unlock"
        );

        uint256 i = candidateIndex[user];

        token.transferFrom(address(this), user, candidateLocks[i]);
    }

    /// @notice Callback to update wrapper's lockable and available amounts.
    /// @param user The address of the user to update values for.
    /// @param amount The amount of tokens to update.
    function updateCallback(address user, uint256 amount) external {
        for (uint256 i = 0; i < candidateAddresses.length; i++) {
            if (candidateAddresses[i] == user) {
                uint256 lockable = token.getLockableAmount(user, address(this));

                candidateIndex[user] = i;

                totalLockableAmount -= candidateWeights[i];
                candidateWeights[i] = lockable;
                totalLockableAmount += candidateWeights[i];

                return;
            }
        }
        candidateAddresses.push(user);
        candidateWeights.push(token.getLockableAmount(user, address(this)));
        candidateLocks.push(0);
    }

    // todo: move getlockableamount here
}
