// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title OptimismModule
 * @notice The OptimismModule contract is used to select sequencers on the L2 network.
 */
contract OptimismModule {
    address[] public sequencers;

    constructor() {
        sequencers = [0xA9f7b7140Ec9EB418caFBEd4C6d8428705ed74f8, 0x89289892E26F4ca1dCea57F5A0d0285F5dcD000f];
    }

    // Returns a sequencer using prevrandao,
    function getSequencer() external view returns (address) {
        uint256 index = block.prevrandao % sequencers.length;
        return sequencers[index];
    }

    function stake() external {
        sequencers.push(msg.sender);
    }
}
