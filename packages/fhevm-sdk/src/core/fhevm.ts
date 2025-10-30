/**
 * Core FHEVM functionality
 * Framework-agnostic core logic for FHEVM operations
 */

import { FhevmConfig } from '../types';
import { createFhevmInstance, encryptValue, getFHEPublicKey, getGatewayUrl } from '../utils/encryption';
import { userDecrypt, publicDecrypt } from '../utils/decryption';
import type { Signer } from 'ethers';

/**
 * FHEVM Core Class
 * Provides framework-agnostic access to FHEVM functionality
 */
export class FhevmCore {
  private instance: any = null;
  private config: FhevmConfig;
  private isInitialized = false;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.instance = await createFhevmInstance(this.config);
      this.isInitialized = true;
      console.log('FHEVM Core initialized');
    } catch (error) {
      console.error('Failed to initialize FHEVM Core:', error);
      throw error;
    }
  }

  /**
   * Check if FHEVM is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.instance !== null;
  }

  /**
   * Get the FHEVM instance
   */
  getInstance(): any {
    if (!this.isReady()) {
      throw new Error('FHEVM instance not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Encrypt a value
   */
  async encrypt(value: number | string): Promise<Uint8Array> {
    if (!this.isReady()) {
      throw new Error('FHEVM instance not initialized. Call init() first.');
    }

    return await encryptValue(this.instance, value);
  }

  /**
   * Decrypt a value with user permission (EIP-712 signature)
   */
  async decrypt(
    encryptedValue: string,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint> {
    if (!this.isReady()) {
      throw new Error('FHEVM instance not initialized. Call init() first.');
    }

    return await userDecrypt(this.instance, encryptedValue, contractAddress, signer);
  }

  /**
   * Public decrypt (no signature required)
   */
  async decryptPublic(encryptedValue: string): Promise<bigint> {
    if (!this.isReady()) {
      throw new Error('FHEVM instance not initialized. Call init() first.');
    }

    return await publicDecrypt(this.instance, encryptedValue);
  }

  /**
   * Get the public key
   */
  getPublicKey(): string {
    return this.config.publicKey || getFHEPublicKey(this.config.chainId);
  }

  /**
   * Get the gateway URL
   */
  getGatewayUrl(): string {
    return this.config.gatewayUrl || getGatewayUrl(this.config.chainId);
  }

  /**
   * Get the chain ID
   */
  getChainId(): number {
    return this.config.chainId;
  }

  /**
   * Destroy the instance
   */
  destroy(): void {
    this.instance = null;
    this.isInitialized = false;
    console.log('FHEVM Core destroyed');
  }
}

/**
 * Create a new FHEVM Core instance
 */
export async function createFhevmCore(config: FhevmConfig): Promise<FhevmCore> {
  const core = new FhevmCore(config);
  await core.init();
  return core;
}
