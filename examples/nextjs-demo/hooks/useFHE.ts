/**
 * useFHE Hook
 * Custom hook for FHE operations in Next.js components
 */

'use client';

import { useFHEVM } from '@fhevm/sdk/react';
import { useState, useCallback } from 'react';
import { FHEType } from '../lib/fhe/types';

export function useFHE() {
  const fhevm = useFHEVM();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const encryptValue = useCallback(
    async (value: any, type: FHEType): Promise<Uint8Array | null> => {
      setIsProcessing(true);
      setLastError(null);

      try {
        let result: Uint8Array | null = null;

        switch (type) {
          case 'uint8':
            result = await fhevm.encrypt8(Number(value));
            break;
          case 'uint16':
            result = await fhevm.encrypt16(Number(value));
            break;
          case 'uint32':
            result = await fhevm.encrypt32(Number(value));
            break;
          case 'uint64':
            result = await fhevm.encrypt64(BigInt(value));
            break;
          case 'uint128':
            result = await fhevm.encrypt128(BigInt(value));
            break;
          case 'uint256':
            result = await fhevm.encrypt256(BigInt(value));
            break;
          case 'bool':
            result = await fhevm.encryptBool(Boolean(value));
            break;
          case 'address':
            result = await fhevm.encryptAddress(String(value));
            break;
        }

        return result;
      } catch (error: any) {
        setLastError(error);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [fhevm]
  );

  return {
    ...fhevm,
    encryptValue,
    isProcessing,
    lastError,
  };
}
