/**
 * useContract Hook
 * Hook for interacting with smart contracts
 */

import { useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { ContractOptions, TransactionOptions } from '../types';

/**
 * Hook to interact with smart contracts
 *
 * @example
 * ```tsx
 * const { contract, call, send, isLoading } = useContract({
 *   address: '0x...',
 *   abi: CONTRACT_ABI,
 * });
 *
 * // Read function
 * const value = await call('getValue', [userId]);
 *
 * // Write function
 * const tx = await send('setValue', [42]);
 * ```
 */
export const useContract = (options: ContractOptions) => {
  const { signer, provider, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create contract instance
  const contract = useMemo(() => {
    if (!options.address || !options.abi) return null;

    const signerOrProvider = options.signer || signer || provider;
    if (!signerOrProvider) return null;

    try {
      return new ethers.Contract(options.address, options.abi, signerOrProvider);
    } catch (err) {
      console.error('Failed to create contract:', err);
      return null;
    }
  }, [options.address, options.abi, options.signer, signer, provider]);

  /**
   * Call a read-only contract function
   */
  const call = useCallback(
    async (methodName: string, args: any[] = []): Promise<any> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract[methodName](...args);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  /**
   * Send a transaction to a contract function
   */
  const send = useCallback(
    async (
      methodName: string,
      args: any[] = [],
      options?: TransactionOptions
    ): Promise<ethers.ContractTransaction> => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      setIsLoading(true);
      setError(null);

      try {
        const txOptions: any = {};
        if (options?.gasLimit) txOptions.gasLimit = options.gasLimit;
        if (options?.gasPrice) txOptions.gasPrice = options.gasPrice;
        if (options?.value) txOptions.value = ethers.utils.parseEther(options.value);

        const tx = await contract[methodName](...args, txOptions);
        return tx;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, isConnected]
  );

  /**
   * Wait for transaction confirmation
   */
  const waitForTransaction = useCallback(
    async (tx: ethers.ContractTransaction, confirmations: number = 1) => {
      setIsLoading(true);
      try {
        const receipt = await tx.wait(confirmations);
        return receipt;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Listen to contract events
   */
  const on = useCallback(
    (eventName: string, callback: (...args: any[]) => void) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      contract.on(eventName, callback);

      // Return cleanup function
      return () => {
        contract.off(eventName, callback);
      };
    },
    [contract]
  );

  return {
    contract,
    call,
    send,
    waitForTransaction,
    on,
    isLoading,
    error,
  };
};
