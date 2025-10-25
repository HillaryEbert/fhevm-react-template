'use client';

import { FHEVMProvider } from '@fhevm/sdk/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FHEVMProvider
      config={{
        chainId: 11155111,
        network: 'sepolia',
        autoInit: true,
      }}
    >
      {children}
    </FHEVMProvider>
  );
}
