/**
 * useEncryption Hook
 * Simplified encryption hook with state management
 */

'use client';

import { useState, useCallback } from 'react';
import { useFHEVM } from '@fhevm/sdk/react';
import { FHEType } from '../lib/fhe/types';

interface EncryptionState {
  isEncrypting: boolean;
  error: Error | null;
  result: Uint8Array | null;
}

export function useEncryption() {
  const { isInitialized, ...fhevm } = useFHEVM();
  const [state, setState] = useState<EncryptionState>({
    isEncrypting: false,
    error: null,
    result: null,
  });

  const encrypt = useCallback(
    async (value: any, type: FHEType) => {
      if (!isInitialized) {
        setState(prev => ({
          ...prev,
          error: new Error('FHEVM not initialized'),
        }));
        return null;
      }

      setState({ isEncrypting: true, error: null, result: null });

      try {
        let encrypted: Uint8Array | null = null;

        switch (type) {
          case 'uint8':
            encrypted = await fhevm.encrypt8(Number(value));
            break;
          case 'uint16':
            encrypted = await fhevm.encrypt16(Number(value));
            break;
          case 'uint32':
            encrypted = await fhevm.encrypt32(Number(value));
            break;
          case 'uint64':
            encrypted = await fhevm.encrypt64(BigInt(value));
            break;
          case 'uint128':
            encrypted = await fhevm.encrypt128(BigInt(value));
            break;
          case 'uint256':
            encrypted = await fhevm.encrypt256(BigInt(value));
            break;
          case 'bool':
            encrypted = await fhevm.encryptBool(Boolean(value));
            break;
          case 'address':
            encrypted = await fhevm.encryptAddress(String(value));
            break;
        }

        setState({ isEncrypting: false, error: null, result: encrypted });
        return encrypted;
      } catch (error: any) {
        setState({ isEncrypting: false, error, result: null });
        return null;
      }
    },
    [isInitialized, fhevm]
  );

  const reset = useCallback(() => {
    setState({ isEncrypting: false, error: null, result: null });
  }, []);

  return {
    encrypt,
    reset,
    ...state,
    isReady: isInitialized,
  };
}
