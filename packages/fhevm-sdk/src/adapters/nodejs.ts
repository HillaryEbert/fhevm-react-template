/**
 * Node.js Adapter for FHEVM SDK
 * Provides Node.js-specific utilities for backend usage
 */

import { FhevmCore, createFhevmCore } from '../core/fhevm';
import { FhevmConfig } from '../types';
import { ethers } from 'ethers';

/**
 * Node.js FHEVM Client
 * For use in backend/server environments
 */
export class FhevmNodeClient {
  private core: FhevmCore | null = null;
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;

  constructor(
    private config: FhevmConfig,
    private rpcUrl?: string,
    private privateKey?: string
  ) {}

  /**
   * Initialize the client
   */
  async init(): Promise<void> {
    this.core = await createFhevmCore(this.config);

    if (this.rpcUrl) {
      this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);

      if (this.privateKey) {
        this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      }
    }

    console.log('FHEVM Node.js client initialized');
  }

  /**
   * Check if client is ready
   */
  isReady(): boolean {
    return this.core !== null && this.core.isReady();
  }

  /**
   * Encrypt a value
   */
  async encrypt(value: number | string): Promise<Uint8Array> {
    if (!this.core) {
      throw new Error('Client not initialized. Call init() first.');
    }
    return await this.core.encrypt(value);
  }

  /**
   * Get the provider
   */
  getProvider(): ethers.providers.JsonRpcProvider | null {
    return this.provider;
  }

  /**
   * Get the wallet
   */
  getWallet(): ethers.Wallet | null {
    return this.wallet;
  }

  /**
   * Get a contract instance
   */
  getContract(address: string, abi: any[]): ethers.Contract {
    if (!this.wallet && !this.provider) {
      throw new Error('No wallet or provider available');
    }

    const signerOrProvider = this.wallet || this.provider;
    return new ethers.Contract(address, abi, signerOrProvider);
  }

  /**
   * Send an encrypted transaction
   */
  async sendEncryptedTransaction(
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[]
  ): Promise<ethers.ContractTransaction> {
    if (!this.wallet) {
      throw new Error('Wallet not configured');
    }

    const contract = this.getContract(contractAddress, abi);
    return await contract[method](...args);
  }

  /**
   * Call a contract method (read-only)
   */
  async call(
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[]
  ): Promise<any> {
    const contract = this.getContract(contractAddress, abi);
    return await contract[method](...args);
  }

  /**
   * Destroy the client
   */
  destroy(): void {
    if (this.core) {
      this.core.destroy();
      this.core = null;
    }
    this.provider = null;
    this.wallet = null;
    console.log('FHEVM Node.js client destroyed');
  }
}

/**
 * Create a Node.js FHEVM client
 */
export async function createNodeClient(
  config: FhevmConfig,
  rpcUrl?: string,
  privateKey?: string
): Promise<FhevmNodeClient> {
  const client = new FhevmNodeClient(config, rpcUrl, privateKey);
  await client.init();
  return client;
}

/**
 * Export default
 */
export default {
  FhevmNodeClient,
  createNodeClient,
};
