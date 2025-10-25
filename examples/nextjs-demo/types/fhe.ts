/**
 * FHE Type Definitions for Next.js Application
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

export interface EncryptedData {
  value: Uint8Array;
  type: FHEType;
  timestamp: number;
}

export interface DecryptionRequest {
  dataId: string;
  requester: string;
  signature?: string;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: Uint8Array[];
}

export interface FHEOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
