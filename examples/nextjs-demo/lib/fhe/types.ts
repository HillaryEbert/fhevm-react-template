/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

export type FHEType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address';

export type EncryptedValue = Uint8Array;

export interface EncryptionResult {
  encrypted: EncryptedValue;
  type: FHEType;
  timestamp: number;
}

export interface DecryptionRequest {
  encryptedData: EncryptedValue;
  signature?: string;
  requester: string;
}

export interface DecryptionResult {
  decrypted: any;
  type: FHEType;
  verified: boolean;
  timestamp: number;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: EncryptedValue[];
  resultType: FHEType;
}

export interface ComputationResult {
  result: EncryptedValue;
  operation: string;
  timestamp: number;
}

export interface FHEConfig {
  chainId: number;
  network: string;
  gatewayUrl?: string;
  publicKey?: string;
  autoInit?: boolean;
}

export interface FHEState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  chainId: number | null;
  publicKey: string | null;
}
