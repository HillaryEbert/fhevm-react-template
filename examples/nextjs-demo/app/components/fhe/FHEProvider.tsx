/**
 * FHEProvider Component
 * Wrapper component for FHE context
 * Note: This re-exports the provider from the SDK
 */

'use client';

import { FHEVMProvider } from '@fhevm/sdk/react';
import { ReactNode } from 'react';

interface FHEProviderProps {
  children: ReactNode;
  chainId?: number;
  network?: string;
  autoInit?: boolean;
}

export default function FHEProvider({
  children,
  chainId = 11155111,
  network = 'sepolia',
  autoInit = true,
}: FHEProviderProps) {
  return (
    <FHEVMProvider
      config={{
        chainId,
        network,
        autoInit,
      }}
    >
      {children}
    </FHEVMProvider>
  );
}
