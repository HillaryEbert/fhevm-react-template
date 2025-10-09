// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { euint8 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title GatewayHelper
 * @notice Helper library for Gateway API compatibility
 * @dev In production, this would be replaced by actual Gateway contract imports
 */
library Gateway {
    /**
     * @notice Check if public decryption is allowed
     * @return bool True if allowed (placeholder always returns true)
     */
    function isPublicDecryptAllowed() internal pure returns (bool) {
        return true; // Simplified for demo
    }

    /**
     * @notice Convert encrypted value to uint256
     * @param value The encrypted value
     * @return uint256 representation (placeholder returns 0)
     */
    function toUint256(euint8 value) internal pure returns (uint256) {
        // In production, this would properly convert euint8 to uint256
        value; // Suppress unused parameter warning
        return uint256(0); // Placeholder
    }

    /**
     * @notice Request decryption from Gateway
     * @return requestId The decryption request ID (placeholder returns 1)
     */
    function requestDecryption(
        uint256[] memory,
        bytes4,
        uint256,
        uint256,
        bool
    ) internal pure returns (uint256) {
        return 1; // Placeholder request ID
    }
}
