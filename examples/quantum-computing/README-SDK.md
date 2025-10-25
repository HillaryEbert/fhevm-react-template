# 🔐 Universal FHEVM SDK

> A comprehensive, framework-agnostic SDK for Zama's Fully Homomorphic Encryption (FHE) blockchain, supporting React, Vue, Next.js, and Node.js

## 🌟 Features

### Core Features
- 🚀 **Framework Agnostic** - Works seamlessly across React, Vue, Next.js, and Node.js
- 📦 **Wagmi-like API** - Familiar, intuitive interface for web3 developers
- 🔐 **Complete FHE Support** - Full encryption/decryption workflow
- 🎯 **Type-Safe** - Written in TypeScript with full type definitions
- 🔄 **Auto Initialization** - Smart auto-connect and reconnect handling
- 🌐 **Multi-Network** - Support for Sepolia, local fhEVM, and custom networks

### New Gateway API Support
- ✨ **New Event Structure** - Direct KMS response events
- ✅ **is Functions** - Boolean-returning check functions instead of reverting
- 🔧 **Multi-Pauser Support** - Multiple KMS and coprocessor addresses
- 🔒 **sIND-CPAD Security** - Automatic transaction input re-randomization

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   ├── fhevm-sdk/              # Core SDK
│   │   └── src/
│   │       ├── core/           # Framework-agnostic core
│   │       ├── react/          # React hooks & components
│   │       └── vue/            # Vue composables
│   └── contracts/              # Smart contracts
│
├── examples/
│   └── nextjs-app/             # Next.js example
│
├── docs/                       # GitHub Pages demo
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
# Install all dependencies
npm run install:all

# Build SDK
npm run build:sdk

# Deploy contracts
npm run deploy:contracts

# Run Next.js example
npm run dev:nextjs
```

## 📖 Usage

### React

```tsx
import { FHEVMProvider, useFHEVM } from '@fhevm/sdk/react';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111, network: 'sepolia', autoInit: true }}>
      <MyComponent />
    </FHEVMProvider>
  );
}

function MyComponent() {
  const { isInitialized, encrypt64 } = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await encrypt64(12345);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Vue

```vue
<script setup>
import { useFHEVM } from '@fhevm/sdk/vue';

const { isInitialized, encrypt64 } = useFHEVM({
  chainId: 11155111,
  network: 'sepolia',
  autoInit: true
});

const handleEncrypt = async () => {
  const encrypted = await encrypt64(12345);
  console.log('Encrypted:', encrypted);
};
</script>

<template>
  <button @click="handleEncrypt" :disabled="!isInitialized">
    Encrypt
  </button>
</template>
```

## 🎯 Key Requirements

- ✅ Completeness: Full initialization, encryption, decryption, contract interaction
- ✅ Reusability: Clean, modular, framework-adaptable components
- ✅ Documentation: Detailed docs and examples
- ✅ Creativity: Multi-environment showcase



## 📄 License

MIT
