/**
 * Core types for FHEVM SDK
 */

import { ethers } from 'ethers';

/**
 * FHEVM Configuration
 */
export interface FhevmConfig {
  /** Chain ID for the network */
  chainId: number;
  /** Gateway URL for FHE operations */
  gatewayUrl?: string;
  /** FHE Public Key */
  publicKey?: string;
  /** Network configuration */
  network?: {
    name: string;
    rpcUrl: string;
  };
}

/**
 * FHEVM Instance state
 */
export interface FhevmInstance {
  instance: any;
  isReady: boolean;
  chainId: number;
}

/**
 * Wallet connection state
 */
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  balance: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

/**
 * Encryption result
 */
export interface EncryptedData {
  data: Uint8Array;
  signature: string;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  ciphertext: any;
  contractAddress: string;
  userAddress: string;
}

/**
 * Contract interaction options
 */
export interface ContractOptions {
  address: string;
  abi: any[];
  signer?: ethers.Signer;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  gasLimit?: number;
  gasPrice?: string;
  value?: string;
}

/**
 * Event listener callback
 */
export type EventCallback = (event: any) => void;

/**
 * SDK Context value
 */
export interface FhevmContextValue {
  fhevmInstance: FhevmInstance | null;
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  encrypt: (value: number | string) => Promise<EncryptedData>;
  decrypt: (request: DecryptionRequest) => Promise<any>;
  isReady: boolean;
  error: Error | null;
}

/**
 * Provider props
 */
export interface FhevmProviderProps {
  config: FhevmConfig;
  children: React.ReactNode;
}
