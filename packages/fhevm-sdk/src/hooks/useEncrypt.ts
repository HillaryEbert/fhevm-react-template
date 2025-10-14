/**
 * useEncrypt Hook
 * Hook for encrypting data using FHEVM
 */

import { useState, useCallback } from 'react';
import { useFhevmContext } from '../providers/FhevmProvider';
import { EncryptedData } from '../types';

/**
 * Hook to encrypt data
 *
 * @example
 * ```tsx
 * const { encrypt, isEncrypting, error } = useEncrypt();
 *
 * const handleEncrypt = async () => {
 *   try {
 *     const encrypted = await encrypt(42);
 *     console.log('Encrypted:', encrypted);
 *   } catch (err) {
 *     console.error('Encryption failed:', err);
 *   }
 * };
 * ```
 */
export const useEncrypt = () => {
  const { encrypt: encryptFn, isReady } = useFhevmContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: number | string): Promise<EncryptedData> => {
      if (!isReady) {
        throw new Error('FHEVM not ready. Please wait for initialization.');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await encryptFn(value);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [encryptFn, isReady]
  );

  return {
    encrypt,
    isEncrypting,
    error,
    isReady,
  };
};
