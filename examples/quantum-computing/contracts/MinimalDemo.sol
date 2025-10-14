// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

/**
 * @title MinimalDemo
 * @notice Minimal demonstration contract for Universal FHEVM SDK
 */
contract MinimalDemo {
    mapping(address => euint64) private values;
    uint256 public counter;

    event ValueSet(address indexed user);

    /**
     * @notice Set a value (uses uint64 for simplicity)
     */
    function setValue(uint64 plainValue) external {
        euint64 encrypted = FHE.asEuint64(plainValue);
        values[msg.sender] = encrypted;

        FHE.allowThis(encrypted);
        FHE.allow(encrypted, msg.sender);

        counter++;
        emit ValueSet(msg.sender);
    }

    /**
     * @notice Add two user values
     */
    function addValues(address user1, address user2) external returns (euint64) {
        return FHE.add(values[user1], values[user2]);
    }

    /**
     * @notice Get user value
     */
    function getValue(address user) external view returns (euint64) {
        return values[user];
    }

    /**
     * @notice Get counter
     */
    function getCounter() external view returns (uint256) {
        return counter;
    }
}
