/**
 * FHEProvider Component
 * Wrapper component for FHE context
 * Note: This re-exports the provider from the SDK
 */

'use client';

import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';
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
    <FhevmProvider
      config={{
        chainId,
        network,
        autoInit,
      }}
    >
      {children}
    </FhevmProvider>
  );
}
