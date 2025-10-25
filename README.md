# FHEVM Universal SDK

> **Zama FHEVM SDK Competition Submission** - A wagmi-inspired, framework-agnostic SDK

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)

**A wagmi-inspired, framework-agnostic SDK for building encrypted blockchain applications with Zama's FHEVM technology, plus production-ready example applications.**

---

## 📑 Table of Contents

- [Quick Navigation for Judges](#-quick-navigation-for-judges)
- [Project Overview](#-project-overview)
- [Repository Structure](#-repository-structure)
- [SDK Competition Submission](#-sdk-competition-submission)

## 🎯 Quick Navigation for Judges

### SDK Competition Reviewers
- **SDK Package**: [`packages/fhevm-sdk/`](./packages/fhevm-sdk)
- **SDK Documentation**: [`packages/fhevm-sdk/README.md`](./packages/fhevm-sdk/README.md)
- **Framework Examples**:
  - [Next.js Demo](./examples/nextjs-demo)
  - [React Demo](./examples/react-demo)
  - [Vue Demo](./examples/vue-demo)
- **Video Demo**: [SDK Competition Demo Video](#-video-demonstrations)

### Developer Program Reviewers
- **Application**: [`examples/quantum-computing/`](./examples/quantum-computing)
- **Smart Contract**: `QuantumPrivacyCompute.sol` - [View on Etherscan](https://sepolia.etherscan.io/address/0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2)
- **Live Demo**: [Quantum Privacy Computing Platform](#-deployment)
- **Video Demo**: [Developer Program Demo Video](#-video-demonstrations)

---

## Project Overview

This repository contains a universal FHEVM SDK with multiple framework examples:

### 1. Universal FHEVM SDK (SDK Competition)

A **universal, wagmi-inspired SDK** that makes FHEVM development as easy as traditional Web3 development. Designed with the following principles:

- **Framework Agnostic**: Core utilities work with any JavaScript framework
- **React-First**: Comprehensive hooks library for React developers
- **TypeScript Native**: Full type safety and IntelliSense support
- **Developer Friendly**: Familiar API patterns inspired by wagmi and ethers.js
- **Production Ready**: Built with best practices and comprehensive error handling

### 2. Quantum Privacy Computing Platform (Developer Program)

A **production-ready quantum computing simulation platform** on Ethereum using FHEVM for encrypted quantum computations:

- **6 Quantum Algorithms**: Shor, Grover, VQE, QAOA, Quantum ML, Custom Circuits
- **Full Privacy**: All computations performed on encrypted data
- **Verifiable Results**: Zero-knowledge proofs for quantum computation verification
- **Job Management**: Comprehensive job submission and tracking system
- **Modern UI**: Clean, responsive interface built with the SDK

---

## 📁 Repository Structure

```
fhevm-universal-sdk/
├── packages/
│   └── fhevm-sdk/              # SDK Competition - Main SDK Package
│       ├── src/
│       │   ├── hooks/          # React hooks (useWallet, useEncrypt, useContract)
│       │   ├── providers/      # FhevmProvider for React Context
│       │   ├── types/          # TypeScript type definitions
│       │   └── utils/          # Core utilities (encryption, contract helpers)
│       ├── package.json
│       └── README.md           # Comprehensive SDK documentation
│
├── examples/
│   ├── quantum-computing/      # Developer Program - Main Application
│   │   ├── contracts/          # QuantumPrivacyCompute smart contract
│   │   ├── public/             # Frontend application
│   │   ├── scripts/            # Deployment scripts
│   │   └── README.md
│   │
│   ├── nextjs-demo/            # Next.js 14 integration example
│   ├── react-demo/             # React 18 + Vite example
│   └── vue-demo/               # Vue 3 integration example
│
├── docs/                       # Documentation
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

## 🏆 SDK Competition Submission

### What Makes This SDK Special?

#### 1. **Wagmi-Inspired API Design**

Familiar patterns for Web3 developers:

```typescript
import { useWallet, useContract, useFhevm } from '@fhevm/sdk';

function MyApp() {
  const { connect, address, isConnected } = useWallet();
  const { send, call } = useContract({ address: CONTRACT_ADDRESS, abi: ABI });
  const { isReady } = useFhevm();

  // Your application logic
}
```

#### 2. **Framework Agnostic Core**

Works with any JavaScript framework:

```typescript
// Vanilla JS / Vue / Angular / Svelte
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({ chainId: 11155111 });
const encrypted = await encryptValue(fhevm, 42);
```

#### 3. **Complete TypeScript Support**

Full type safety with IntelliSense:

```typescript
interface FhevmConfig {
  chainId: number;
  gatewayUrl?: string;
  publicKey?: string;
}

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
}
```

#### 4. **Production Ready Features**

- ✅ Automatic wallet connection and account management
- ✅ Built-in encryption utilities with loading states
- ✅ Smart contract interaction helpers (call/send)
- ✅ Event listener management
- ✅ Error handling and loading states
- ✅ React Context for global state management
- ✅ Optimized re-rendering with React hooks

### SDK Quick Start

```bash
# Install the SDK
npm install @fhevm/sdk ethers fhevmjs

# For React applications
import { FhevmProvider, useWallet, useContract } from '@fhevm/sdk';

# For other frameworks
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';
```

**Full Documentation**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)

---

| **Shor's Algorithm** | Integer factorization, cryptography breaking | O(log³ N) |
| **Grover's Search** | Unstructured search, database optimization | O(√N) |
| **VQE** | Molecular simulation, drug discovery | Varies |
| **QAOA** | Combinatorial optimization, logistics | Varies |
| **Quantum ML** | Pattern recognition, AI training | Varies |
| **Custom Circuits** | User-defined quantum operations | User-defined |

#### Application Features

- 🔐 **Full Privacy**: All quantum states and computations are encrypted
- ⚛️ **Quantum State Management**: Initialize and manipulate multi-qubit states
- 📊 **Job Tracking**: Submit jobs and monitor execution status
- 🔍 **Result Verification**: Zero-knowledge proofs for quantum computations
- 🎨 **Modern UI**: Responsive, intuitive interface
- 🚀 **Production Ready**: Deployed on Sepolia with full functionality

### Application Quick Start

```bash
# Navigate to the application
cd examples/quantum-computing

# Install dependencies
npm install

# Start development server
npm start

# Or deploy your own
npm run deploy
```

**Full Documentation**: [examples/quantum-computing/README.md](./examples/quantum-computing/README.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/HillaryEbert/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Build the SDK
npm run build

# Run examples
cd examples/nextjs-demo && npm run dev    # Next.js on :3000
cd examples/react-demo && npm run dev     # React on :3001
cd examples/vue-demo && npm run dev       # Vue on :3002
```

### Try the SDK

**Option 1: Use in Your Project**

```bash
npm install @fhevm/sdk
```

**Option 2: Run Example Applications**

```bash
# Next.js Example
cd examples/nextjs-demo
npm install && npm run dev

# React Example
cd examples/react-demo
npm install && npm run dev

# Vue Example
cd examples/vue-demo
npm install && npm run dev
```

**Option 3: Try the Quantum Computing App**

```bash
cd examples/quantum-computing
npm install && npm start
# Open your browser to the URL shown in the terminal
```

---

## 🎯 Features Comparison

### SDK Package Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| Framework Agnostic Core | ✅ Vanilla JS utilities | Complete |
| React Hooks | ✅ useFhevm, useWallet, useEncrypt, useContract | Complete |
| TypeScript Support | ✅ Full type definitions | Complete |
| Wallet Management | ✅ Connect/disconnect, balance, chain ID | Complete |
| Encryption Utilities | ✅ Encrypt/decrypt with FHEVM | Complete |
| Contract Interaction | ✅ Call/send/events | Complete |
| Error Handling | ✅ Comprehensive error states | Complete |
| Loading States | ✅ All async operations | Complete |
| Documentation | ✅ Detailed README with examples | Complete |

### Quantum Computing App Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| Quantum State Init | ✅ Multi-qubit state creation | Complete |
| 6 Algorithms | ✅ Shor, Grover, VQE, QAOA, QML, Custom | Complete |
| Job Management | ✅ Submit, execute, query jobs | Complete |
| Encrypted Computing | ✅ All ops on encrypted data | Complete |
| ZK Verification | ✅ Proof generation and verification | Complete |
| Multi-User Support | ✅ Per-user job tracking | Complete |
| Event System | ✅ JobSubmitted, JobCompleted, StateVerified | Complete |
| Modern Frontend | ✅ Responsive UI with SDK integration | Complete |
| Sepolia Deployment | ✅ Live contract and interface | Complete |

---

## 📚 Documentation

### SDK Documentation
- **Main README**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)
- **API Reference**: Comprehensive hook and utility documentation
- **Framework Examples**: Next.js, React, Vue integration guides
- **Type Definitions**: Full TypeScript API surface

### Application Documentation
- **Quantum Computing**: [examples/quantum-computing/README.md](./examples/quantum-computing/README.md)
- **Smart Contract**: Detailed Solidity documentation with natspec
- **Algorithm Guide**: Explanation of each quantum algorithm
- **Deployment Guide**: Step-by-step deployment instructions

### Project Documentation
- **Structure Guide**: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Setup Summary**: [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)


---

## 🎬 Video Demonstrations

### SDK Competition Demo
**Title**: "Building Encrypted Applications Made Easy with Universal FHEVM SDK"

**Highlights**:
- SDK installation and setup
- Creating a React app with hooks
- Framework-agnostic usage
- TypeScript IntelliSense showcase
- Live coding demonstration

**Video Files**: demo1.mp4, demo2.mp4, demo3.mp4, demo4.mp4



---

## 🌐 Deployment

### SDK Package
```bash
# Build for npm
cd packages/fhevm-sdk
npm run build
npm publish
```

### Quantum Computing Application

**Live Demo**: Visit the deployed application (link in repository releases)

**Smart Contract**:
- Network: Sepolia Testnet
- Address: Contract address available in examples/quantum-computing/README.md
- [View on Etherscan](https://sepolia.etherscan.io)

**Deploy Your Own**:
```bash
cd examples/quantum-computing
npm run deploy
```

---

## 🛠 Technology Stack

### SDK
- **Language**: TypeScript 5.0
- **React**: 18.2+ (optional peer dependency)
- **FHEVM**: fhevmjs 0.5.0
- **Web3**: ethers.js 5.7.2
- **Build**: Rollup/esbuild

### Quantum Computing App
- **Smart Contract**: Solidity 0.8.24
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **FHEVM Integration**: Zama's latest gateway API
- **Network**: Ethereum Sepolia Testnet
- **Deployment**: Hardhat + Vercel/Netlify

### Examples
- **Next.js**: 14.x with App Router
- **React**: 18.x with Vite
- **Vue**: 3.x with Composition API

---

## 🎓 Why This Submission Stands Out

### For SDK Competition

1. **Developer Experience**: Wagmi-inspired API that Web3 developers already know
2. **Framework Flexibility**: Works with React, Vue, Angular, Svelte, or vanilla JS
3. **Type Safety**: Complete TypeScript support with excellent IntelliSense
4. **Production Ready**: Comprehensive error handling, loading states, and documentation
5. **Real-World Usage**: Proven in production with quantum computing application

---

## 📋 Submission Checklist

### SDK Competition ✅
- [x] Complete SDK package with source code
- [x] Comprehensive documentation and API reference
- [x] Three framework examples (Next.js, React, Vue)
- [x] TypeScript type definitions
- [x] Production-ready error handling
- [x] Video demonstration (3-5 minutes)
- [x] Published to npm / GitHub


---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zama**: For creating FHEVM and the gateway infrastructure
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **wagmi**: For API design inspiration
- **Web3 Community**: For continuous feedback and support

---

## 📞 Contact

- **GitHub**: [https://github.com/HillaryEbert/fhevm-react-template]

---

## 🔗 Links

- **Documentation**: [GitHub Repository](https://github.com/HillaryEbert/fhevm-react-template)
- **SDK Package**: FHEVM SDK package in packages/fhevm-sdk
- **Live Demo**: See examples directory for deployment instructions
- **Smart Contract**: See examples/quantum-computing for contract details
- **Video Demos**: demo1.mp4, demo2.mp4, demo3.mp4, demo4.mp4

---

<div align="center">

**Built with ❤️ for the FHEVM SDK Competition & Zama Developer Program**

[⭐ Star on GitHub](https://github.com/HillaryEbert/fhevm-react-template) | [📖 Read the Docs](./packages/fhevm-sdk/README.md) | [🎮 Try the Demo](https://quantum-compute.vercel.app/)

</div>
