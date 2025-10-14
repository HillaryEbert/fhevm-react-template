/**
 * FHEVM Universal SDK
 * Framework-agnostic SDK for confidential smart contracts
 *
 * @packageDocumentation
 */

// Export types
export * from './types';

// Export providers
export { FhevmProvider, useFhevmContext, FhevmContext } from './providers/FhevmProvider';

// Export hooks
export { useFhevm } from './hooks/useFhevm';
export { useWallet } from './hooks/useWallet';
export { useEncrypt } from './hooks/useEncrypt';
export { useContract } from './hooks/useContract';

// Export utilities
export {
  getFHEPublicKey,
  getGatewayUrl,
  createFhevmInstance,
  encryptValue,
  formatAddress,
  isValidAddress,
  hexToDecimal,
  decimalToHex,
} from './utils/encryption';

// Export version
export const VERSION = '1.0.0';

// Default export for convenience
export { FhevmProvider as default } from './providers/FhevmProvider';
