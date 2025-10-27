# Getting Started with FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in your project.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher
- npm or yarn package manager
- Basic knowledge of TypeScript/JavaScript
- Familiarity with React (for React integration)
- MetaMask or compatible Web3 wallet

## Installation

### For React/Next.js Projects

```bash
npm install @fhevm/sdk ethers fhevmjs
```

or with yarn:

```bash
yarn add @fhevm/sdk ethers fhevmjs
```

### For Other Frameworks

The SDK works with any JavaScript framework. Install the core package:

```bash
npm install @fhevm/sdk ethers fhevmjs
```

## Quick Start - React

### 1. Wrap Your App with Provider

```typescript
// app/providers.tsx
'use client';

import { FHEVMProvider } from '@fhevm/sdk/react';

export function Providers({ children }: { children: React.ReactNode }) {
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
```

### 2. Use Hooks in Your Components

```typescript
'use client';

import { useFHEVM } from '@fhevm/sdk/react';
import { useState } from 'react';

export default function EncryptionDemo() {
  const { isInitialized, encrypt64, error } = useFHEVM();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState<Uint8Array | null>(null);

  const handleEncrypt = async () => {
    const result = await encrypt64(BigInt(value));
    setEncrypted(result);
  };

  if (!isInitialized) {
    return <div>Initializing FHEVM...</div>;
  }

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a number"
      />
      <button onClick={handleEncrypt}>Encrypt</button>

      {encrypted && (
        <div>
          <p>Encrypted: {Array.from(encrypted).join(',')}</p>
        </div>
      )}

      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Quick Start - Vanilla JavaScript

### 1. Initialize FHEVM

```typescript
import { createFhevmInstance } from '@fhevm/sdk';

async function init() {
  const fhevm = await createFhevmInstance({
    chainId: 11155111,
    network: 'sepolia',
  });

  return fhevm;
}
```

### 2. Encrypt Data

```typescript
import { encryptValue } from '@fhevm/sdk';

async function encryptData() {
  const fhevm = await init();

  // Encrypt a 64-bit unsigned integer
  const encrypted = await fhevm.encrypt64(BigInt(12345));

  console.log('Encrypted:', encrypted);
  return encrypted;
}
```

## Quick Start - Vue 3

### 1. Create a Composable

```typescript
// composables/useFHEVM.ts
import { ref, onMounted } from 'vue';
import { createFhevmInstance } from '@fhevm/sdk';

export function useFHEVM() {
  const isInitialized = ref(false);
  const error = ref<Error | null>(null);
  const instance = ref<any>(null);

  onMounted(async () => {
    try {
      instance.value = await createFhevmInstance({
        chainId: 11155111,
        network: 'sepolia',
      });
      isInitialized.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  const encrypt64 = async (value: bigint) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encrypt64(value);
  };

  return {
    isInitialized,
    error,
    encrypt64,
  };
}
```

### 2. Use in Component

```vue
<template>
  <div>
    <input v-model="value" type="number" placeholder="Enter a number" />
    <button @click="handleEncrypt" :disabled="!isInitialized">
      Encrypt
    </button>
    <div v-if="encrypted">
      <p>Encrypted successfully!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFHEVM } from '@/composables/useFHEVM';

const { isInitialized, encrypt64 } = useFHEVM();
const value = ref('');
const encrypted = ref<Uint8Array | null>(null);

const handleEncrypt = async () => {
  encrypted.value = await encrypt64(BigInt(value.value));
};
</script>
```

## Next Steps

1. **Explore Examples**: Check out the [examples directory](../examples) for complete working applications
2. **Read API Documentation**: Learn about all available methods in the [API Reference](./api-reference.md)
3. **Follow Best Practices**: Review [Best Practices](./best-practices.md) for production use
4. **Framework Integration**: See detailed guides in [Framework Integration](./framework-integration.md)

## Configuration Options

### FHEVMProvider Config

```typescript
interface FHEVMConfig {
  chainId: number;           // Network chain ID (e.g., 11155111 for Sepolia)
  network?: string;          // Network name (e.g., 'sepolia')
  gatewayUrl?: string;       // Custom gateway URL
  publicKey?: string;        // Pre-loaded public key
  autoInit?: boolean;        // Auto-initialize on mount (default: false)
}
```

### Example Configurations

**Sepolia Testnet:**
```typescript
{
  chainId: 11155111,
  network: 'sepolia',
  autoInit: true,
}
```

**Custom Gateway:**
```typescript
{
  chainId: 11155111,
  gatewayUrl: 'https://custom-gateway.example.com',
  autoInit: true,
}
```

## Common Use Cases

### 1. Encrypt User Input

```typescript
const { encrypt32 } = useFHEVM();

const encryptedAge = await encrypt32(25);
```

### 2. Store Encrypted Data in Contract

```typescript
const { encrypt64 } = useFHEVM();
const { send } = useContract({ address, abi });

const encrypted = await encrypt64(BigInt(1000));
const tx = await send('storeValue', encrypted);
await tx.wait();
```

### 3. Decrypt Data

```typescript
const { call } = useContract({ address, abi });

// Request decryption
const tx = await send('requestDecryption', dataId);
await tx.wait();

// Wait for KMS to process
// Listen for decryption event
```

## Troubleshooting

### FHEVM Won't Initialize

- Check that you're on the correct network (Sepolia)
- Ensure MetaMask is connected
- Verify you have test ETH for gas

### Encryption Fails

- Verify the value is within the valid range for the type
- Check that FHEVM is initialized (`isInitialized === true`)
- Review console for detailed error messages

### TypeScript Errors

- Ensure you have `@types/node` installed
- Check that your `tsconfig.json` includes proper types
- Install all peer dependencies

## Learn More

- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - More code examples
- [Architecture](./architecture.md) - How the SDK works
- [Best Practices](./best-practices.md) - Production guidelines

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/HillaryEbert/fhevm-react-template/issues)
- Documentation: [Full documentation](./README.md)
- Examples: [Working examples](../examples)
