/**
 * useFhevm Hook
 * Main hook for accessing FHEVM functionality
 */

import { useFhevmContext } from '../providers/FhevmProvider';

/**
 * Hook to access FHEVM instance and wallet state
 *
 * @example
 * ```tsx
 * const { fhevmInstance, wallet, isReady } = useFhevm();
 *
 * if (!isReady) return <div>Loading...</div>;
 * ```
 */
export const useFhevm = () => {
  const context = useFhevmContext();

  return {
    fhevmInstance: context.fhevmInstance,
    wallet: context.wallet,
    isReady: context.isReady,
    error: context.error,
  };
};
