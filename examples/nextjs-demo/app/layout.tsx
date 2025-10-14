'use client';

import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider config={{ chainId: 11155111 }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
