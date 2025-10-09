/**
 * Encryption utilities for FHEVM
 */

import { FhevmConfig } from '../types';

/**
 * Get FHE public key based on chain ID
 */
export function getFHEPublicKey(chainId: number): string {
  const keys: Record<number, string> = {
    9000: 'YOUR_PUBLIC_KEY_FOR_SEPOLIA',
    8009: 'YOUR_PUBLIC_KEY_FOR_LOCALHOST',
    11155111: 'YOUR_PUBLIC_KEY_FOR_SEPOLIA_11155111',
  };
  return keys[chainId] || keys[9000];
}

/**
 * Get Gateway URL based on chain ID
 */
export function getGatewayUrl(chainId: number): string {
  const urls: Record<number, string> = {
    9000: 'https://gateway.sepolia.zama.ai',
    8009: 'http://localhost:8009',
    11155111: 'https://gateway.sepolia.zama.ai',
  };
  return urls[chainId] || urls[9000];
}

/**
 * Initialize FHEVM instance
 */
export async function createFhevmInstance(config: FhevmConfig): Promise<any> {
  // Check if fhevmjs is loaded
  if (typeof window !== 'undefined' && typeof (window as any).fhevm === 'undefined') {
    throw new Error('fhevmjs library not loaded. Please include the fhevmjs script.');
  }

  const fhevm = typeof window !== 'undefined' ? (window as any).fhevm : null;

  if (!fhevm) {
    throw new Error('fhevmjs not available');
  }

  const publicKey = config.publicKey || getFHEPublicKey(config.chainId);
  const gatewayUrl = config.gatewayUrl || getGatewayUrl(config.chainId);

  try {
    const instance = await fhevm.createInstance({
      chainId: config.chainId,
      publicKey,
      gatewayUrl,
    });

    return instance;
  } catch (error) {
    console.error('Failed to create FHEVM instance:', error);
    throw error;
  }
}

/**
 * Encrypt a number value
 */
export async function encryptValue(
  fhevmInstance: any,
  value: number | string
): Promise<Uint8Array> {
  if (!fhevmInstance) {
    throw new Error('FHEVM instance not initialized');
  }

  try {
    const numValue = typeof value === 'string' ? parseInt(value) : value;

    if (numValue < 0 || numValue > 255) {
      throw new Error('Value must be between 0 and 255');
    }

    const encrypted = await fhevmInstance.encrypt8(numValue);
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert hex to decimal
 */
export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Convert decimal to hex
 */
export function decimalToHex(decimal: number): string {
  return '0x' + decimal.toString(16);
}
