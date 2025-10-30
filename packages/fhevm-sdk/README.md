# @quantum-privacy/fhevm-sdk

> Universal FHEVM SDK for confidential smart contracts - Framework agnostic, developer-friendly

[![npm version](https://img.shields.io/npm/v/@quantum-privacy/fhevm-sdk.svg)](https://www.npmjs.com/package/@quantum-privacy/fhevm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe SDK for building confidential decentralized applications with Fully Homomorphic Encryption (FHE) on Ethereum. Inspired by wagmi's developer experience.

## ✨ Features

- ⚡ **Framework Agnostic** - Works with React, Vue, Next.js, or vanilla JavaScript
- 🎯 **Wagmi-like API** - Familiar and intuitive for web3 developers
- 📦 **All-in-One Package** - No scattered dependencies to manage
- 🔐 **Complete FHEVM Workflow** - Initialization, encryption, decryption, and contract interaction
- 🎨 **TypeScript First** - Full type safety and IntelliSense support
- 🪝 **React Hooks** - Built-in hooks for React applications
- 📚 **Well Documented** - Comprehensive guides and examples

## 🚀 Quick Start

### Installation

```bash
npm install @quantum-privacy/fhevm-sdk
# or
yarn add @quantum-privacy/fhevm-sdk
# or
pnpm add @quantum-privacy/fhevm-sdk
```

### Basic Usage (< 10 lines)

```tsx
import { FhevmProvider, useWallet, useEncrypt } from '@quantum-privacy/fhevm-sdk';

function App() {
  return (
    <FhevmProvider config={{ chainId: 11155111 }}>
      <YourComponent />
    </FhevmProvider>
  );
}

function YourComponent() {
  const { connect, address } = useWallet();
  const { encrypt } = useEncrypt();

  return <button onClick={connect}>Connect Wallet</button>;
}
```

That's it! 🎉 You're ready to build confidential applications.

## 📖 Documentation

### Core Concepts

#### 1. Provider Setup

Wrap your application with `FhevmProvider`:

```tsx
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';

function App() {
  return (
    <FhevmProvider
      config={{
        chainId: 11155111, // Sepolia
        gatewayUrl: 'https://gateway.sepolia.zama.ai',
      }}
    >
      {/* Your app */}
    </FhevmProvider>
  );
}
```

#### 2. Wallet Connection

Use the `useWallet` hook:

```tsx
import { useWallet } from '@quantum-privacy/fhevm-sdk';

function WalletButton() {
  const { connect, disconnect, address, isConnected } = useWallet();

  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? `Connected: ${address}` : 'Connect Wallet'}
    </button>
  );
}
```

#### 3. Encryption

Encrypt data before sending to contracts:

```tsx
import { useEncrypt } from '@quantum-privacy/fhevm-sdk';

function EncryptInput() {
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    console.log('Encrypted data:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

#### 4. Decryption

Decrypt encrypted data with user permission:

```tsx
import { userDecrypt, publicDecrypt } from '@quantum-privacy/fhevm-sdk';
import { useFhevm } from '@quantum-privacy/fhevm-sdk';
import { ethers } from 'ethers';

function DecryptData() {
  const { fhevmInstance } = useFhevm();

  const handleUserDecrypt = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // User decryption requires EIP-712 signature
    const decrypted = await userDecrypt(
      fhevmInstance,
      encryptedValue,
      contractAddress,
      signer
    );
    console.log('Decrypted value:', decrypted);
  };

  const handlePublicDecrypt = async () => {
    // Public decryption (no signature required)
    const decrypted = await publicDecrypt(fhevmInstance, encryptedValue);
    console.log('Decrypted value:', decrypted);
  };

  return (
    <>
      <button onClick={handleUserDecrypt}>Decrypt (User)</button>
      <button onClick={handlePublicDecrypt}>Decrypt (Public)</button>
    </>
  );
}
```

#### 5. Contract Interaction

Interact with smart contracts:

```tsx
import { useContract } from '@quantum-privacy/fhevm-sdk';

const CONTRACT_ABI = [/* your ABI */];
const CONTRACT_ADDRESS = '0x...';

function ContractInteraction() {
  const { call, send, isLoading } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const readValue = async () => {
    const value = await call('getValue', [userId]);
    console.log('Value:', value);
  };

  const writeValue = async () => {
    const tx = await send('setValue', [encryptedValue]);
    await tx.wait();
    console.log('Transaction confirmed!');
  };

  return (
    <>
      <button onClick={readValue}>Read</button>
      <button onClick={writeValue} disabled={isLoading}>Write</button>
    </>
  );
}
```

## 🎯 API Reference

### Hooks

#### `useFhevm()`

Access FHEVM instance and status.

```tsx
const { fhevmInstance, isReady, error } = useFhevm();
```

#### `useWallet()`

Manage wallet connection.

```tsx
const {
  connect,        // Connect wallet
  disconnect,     // Disconnect wallet
  address,        // User address
  chainId,        // Current chain ID
  balance,        // Wallet balance
  isConnected,    // Connection status
  provider,       // Ethers provider
  signer          // Ethers signer
} = useWallet();
```

#### `useEncrypt()`

Encrypt data.

```tsx
const {
  encrypt,        // Encrypt function
  isEncrypting,   // Loading state
  error,          // Error if any
  isReady         // Ready state
} = useEncrypt();
```

#### `useContract(options)`

Interact with contracts.

```tsx
const {
  contract,            // Contract instance
  call,                // Call read functions
  send,                // Send transactions
  waitForTransaction,  // Wait for tx confirmation
  on,                  // Listen to events
  isLoading,           // Loading state
  error                // Error if any
} = useContract({
  address: '0x...',
  abi: CONTRACT_ABI,
});
```

### Utilities

#### General Utilities

```tsx
import {
  formatAddress,      // Format address for display
  isValidAddress,     // Validate Ethereum address
  hexToDecimal,       // Convert hex to decimal
  decimalToHex,       // Convert decimal to hex
  getFHEPublicKey,    // Get FHE public key for chain
  getGatewayUrl,      // Get gateway URL for chain
} from '@quantum-privacy/fhevm-sdk';
```

#### Decryption Utilities

```tsx
import {
  userDecrypt,        // Decrypt with user EIP-712 signature
  publicDecrypt,      // Decrypt public data (no signature)
  batchUserDecrypt,   // Decrypt multiple values at once
  requestDecryption,  // Request decryption from KMS Gateway
  canDecrypt,         // Check if value can be decrypted
  parseDecryptedValue // Parse decrypted value to specific type
} from '@quantum-privacy/fhevm-sdk';

// User decryption with EIP-712 signature
const decrypted = await userDecrypt(
  fhevmInstance,
  encryptedValue,
  contractAddress,
  signer
);

// Public decryption
const publicValue = await publicDecrypt(fhevmInstance, encryptedValue);

// Batch decrypt multiple values
const decryptedArray = await batchUserDecrypt(
  fhevmInstance,
  [encryptedValue1, encryptedValue2],
  contractAddress,
  signer
);

// Parse decrypted value to specific type
const parsedValue = parseDecryptedValue(decrypted, 'uint32'); // Returns number
const parsedBool = parseDecryptedValue(decrypted, 'bool');    // Returns boolean
const parsedAddr = parseDecryptedValue(decrypted, 'address'); // Returns string
```

## 🌐 Framework-Specific Examples

### React

```tsx
import { FhevmProvider, useWallet, useEncrypt } from '@quantum-privacy/fhevm-sdk';

function App() {
  return (
    <FhevmProvider config={{ chainId: 11155111 }}>
      <MyComponent />
    </FhevmProvider>
  );
}
```

### Next.js

```tsx
// pages/_app.tsx
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';

function MyApp({ Component, pageProps }) {
  return (
    <FhevmProvider config={{ chainId: 11155111 }}>
      <Component {...pageProps} />
    </FhevmProvider>
  );
}

export default MyApp;
```

### Vue 3

```vue
<script setup>
import { createFhevmInstance } from '@quantum-privacy/fhevm-sdk';
import { ref, onMounted } from 'vue';

const fhevmInstance = ref(null);

onMounted(async () => {
  fhevmInstance.value = await createFhevmInstance({
    chainId: 11155111
  });
});
</script>
```

### Vanilla JavaScript

```javascript
import { createFhevmInstance, encryptValue } from '@quantum-privacy/fhevm-sdk';

async function main() {
  const fhevm = await createFhevmInstance({ chainId: 11155111 });
  const encrypted = await encryptValue(fhevm, 42);
  console.log('Encrypted:', encrypted);
}

main();
```

## 🏗️ Architecture

```
@quantum-privacy/fhevm-sdk
├── src/
│   ├── types/              # TypeScript definitions
│   ├── providers/          # React Context providers
│   ├── hooks/              # React hooks
│   └── utils/              # Utility functions
├── dist/                   # Compiled output
└── examples/               # Usage examples
```

## 📦 Bundle Size

- **Core**: ~15KB (gzipped)
- **With React**: ~25KB (gzipped)
- **Zero runtime dependencies** (peer deps only)

## 🔧 Configuration

### FhevmConfig

```typescript
interface FhevmConfig {
  chainId: number;              // Network chain ID
  gatewayUrl?: string;          // Gateway URL (auto-detected)
  publicKey?: string;           // FHE public key (auto-detected)
  network?: {
    name: string;
    rpcUrl: string;
  };
}
```

### Supported Networks

- **Sepolia** (Chain ID: 11155111)
- **Local** (Chain ID: 8009)
- **Custom networks** (provide config)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

## 🔗 Links

- [Documentation](https://docs.your-project.com)
- [GitHub](https://github.com/your-username/fhevm-universal-sdk)
- [npm](https://www.npmjs.com/package/@quantum-privacy/fhevm-sdk)
- [Examples](../../examples)

## 💬 Support

- 💬 [Discord](https://discord.gg/your-server)
- 🐛 [Issues](https://github.com/your-username/fhevm-universal-sdk/issues)
- 📧 [Email](mailto:your-email@example.com)

---

Built with ❤️ for the Zama FHEVM community
