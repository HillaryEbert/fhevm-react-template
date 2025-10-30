/**
 * API Type Definitions for Next.js Routes
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface EncryptionAPIRequest {
  value: any;
  type: string;
}

export interface DecryptionAPIRequest {
  encryptedData: string;
  signature?: string;
}

export interface ComputationAPIRequest {
  operation: string;
  operands: any[];
}

export interface KeyAPIResponse {
  publicKey: {
    key: string;
    network: string;
    chainId: number;
    timestamp: string;
  };
}
