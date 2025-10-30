'use client';

import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FhevmProvider
      config={{
        chainId: 11155111,
      }}
    >
      {children}
    </FhevmProvider>
  );
}
