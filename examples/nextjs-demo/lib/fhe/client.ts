/**
 * Client-side FHE Operations
 * Provides utilities for FHE operations in browser environment
 */

import { FhevmInstance } from 'fhevmjs';

export class FHEClient {
  private instance: FhevmInstance | null = null;

  constructor(instance: FhevmInstance) {
    this.instance = instance;
  }

  /**
   * Encrypt a value with specified type
   */
  async encrypt(value: number | bigint | boolean | string, type: string): Promise<Uint8Array> {
    if (!this.instance) {
      throw new Error('FHE instance not initialized');
    }

    // Delegate to instance methods based on type
    switch (type) {
      case 'uint8':
        return this.instance.encrypt8(Number(value));
      case 'uint16':
        return this.instance.encrypt16(Number(value));
      case 'uint32':
        return this.instance.encrypt32(Number(value));
      case 'uint64':
        return this.instance.encrypt64(BigInt(value));
      case 'uint128':
        return this.instance.encrypt128(BigInt(value));
      case 'uint256':
        return this.instance.encrypt256(BigInt(value));
      case 'bool':
        return this.instance.encryptBool(Boolean(value));
      case 'address':
        return this.instance.encryptAddress(String(value));
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Get the FHE instance
   */
  getInstance(): FhevmInstance | null {
    return this.instance;
  }

  /**
   * Check if client is ready
   */
  isReady(): boolean {
    return this.instance !== null;
  }
}

export default FHEClient;
