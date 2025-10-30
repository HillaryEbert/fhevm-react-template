/**
 * Decryption utilities for FHEVM
 * Handles user decryption and public decryption operations
 */

import { ethers } from 'ethers';

/**
 * Request user decryption via EIP-712 signature
 * Used for private data decryption with user permission
 */
export async function userDecrypt(
  instance: any,
  encryptedValue: string,
  contractAddress: string,
  signer: ethers.Signer
): Promise<bigint> {
  if (!instance) {
    throw new Error('FHEVM instance not initialized');
  }

  try {
    // Get the user's address
    const userAddress = await signer.getAddress();

    // Create the EIP-712 message for decryption
    const domain = {
      name: 'FHEVM Decryption',
      version: '1',
      chainId: await signer.getChainId(),
      verifyingContract: contractAddress,
    };

    const types = {
      Decrypt: [
        { name: 'encryptedValue', type: 'bytes' },
        { name: 'userAddress', type: 'address' },
      ],
    };

    const value = {
      encryptedValue,
      userAddress,
    };

    // Request signature from user
    const signature = await signer._signTypedData(domain, types, value);

    // Call the gateway to decrypt
    const decryptedValue = await instance.decrypt(encryptedValue, signature);

    return BigInt(decryptedValue);
  } catch (error) {
    console.error('User decryption failed:', error);
    throw new Error(`Failed to decrypt value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Public decryption for non-sensitive data
 * Does not require user signature
 */
export async function publicDecrypt(
  instance: any,
  encryptedValue: string
): Promise<bigint> {
  if (!instance) {
    throw new Error('FHEVM instance not initialized');
  }

  try {
    const decryptedValue = await instance.publicDecrypt(encryptedValue);
    return BigInt(decryptedValue);
  } catch (error) {
    console.error('Public decryption failed:', error);
    throw new Error(`Failed to decrypt value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Request decryption from the KMS Gateway
 * Handles the full flow of requesting decryption from the gateway
 */
export async function requestDecryption(
  gatewayUrl: string,
  encryptedValue: string,
  contractAddress: string,
  userAddress: string,
  signature: string
): Promise<bigint> {
  try {
    const response = await fetch(`${gatewayUrl}/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryptedValue,
        contractAddress,
        userAddress,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gateway request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return BigInt(data.decryptedValue);
  } catch (error) {
    console.error('Gateway decryption request failed:', error);
    throw new Error(`Failed to request decryption: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch decrypt multiple values
 * More efficient than decrypting one at a time
 */
export async function batchUserDecrypt(
  instance: any,
  encryptedValues: string[],
  contractAddress: string,
  signer: ethers.Signer
): Promise<bigint[]> {
  if (!instance) {
    throw new Error('FHEVM instance not initialized');
  }

  try {
    const results = await Promise.all(
      encryptedValues.map((value) =>
        userDecrypt(instance, value, contractAddress, signer)
      )
    );
    return results;
  } catch (error) {
    console.error('Batch decryption failed:', error);
    throw new Error(`Failed to batch decrypt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a value can be decrypted
 * Validates the encrypted value format
 */
export function canDecrypt(encryptedValue: string): boolean {
  if (!encryptedValue || typeof encryptedValue !== 'string') {
    return false;
  }

  // Check if it's a valid hex string
  if (!encryptedValue.startsWith('0x')) {
    return false;
  }

  // Check minimum length (should be at least a few bytes)
  if (encryptedValue.length < 10) {
    return false;
  }

  return true;
}

/**
 * Parse decrypted value to specific type
 */
export function parseDecryptedValue(
  decryptedValue: bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'bool' | 'address'
): number | boolean | string {
  switch (type) {
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
      return Number(decryptedValue);
    case 'uint128':
    case 'uint256':
      return decryptedValue.toString();
    case 'bool':
      return decryptedValue > 0n;
    case 'address':
      return '0x' + decryptedValue.toString(16).padStart(40, '0');
    default:
      return Number(decryptedValue);
  }
}
