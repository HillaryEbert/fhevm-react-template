# FHEVM Universal SDK

> **Zama FHEVM SDK Competition Submission** - A wagmi-inspired, framework-agnostic SDK

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)

**A wagmi-inspired, framework-agnostic SDK for building encrypted blockchain applications with Zama's FHEVM technology, plus production-ready example applications.**

## 🎬 Demo

**Video Demonstration**: (demo1.mp4 demo2.mp4 demo3.mp4 demo4.mp4)

**Live Application**: [https://quantum-compute.vercel.app/](https://quantum-compute.vercel.app/)

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
│   ├── README.md               # Documentation index
│   ├── getting-started.md      # Quick start guide
│   ├── api-reference.md        # Complete API docs
│   ├── framework-integration.md # Framework guides
│   ├── architecture.md         # System architecture
│   ├── examples.md             # Code examples
│   ├── best-practices.md       # Production guidelines
│   ├── troubleshooting.md      # Common issues
│   └── migration-guide.md      # Migration guide
│
├── templates/                  # Quick-start templates
│   ├── README.md               # Template guide
│   ├── nextjs/                 # Next.js template
│   ├── react/                  # React template
│   ├── vue/                    # Vue template
│   └── nodejs/                 # Node.js template
│
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

### Quick Start Options

Choose the best option for your needs:

#### Option 1: Use a Template (Fastest)

Get started immediately with our pre-built templates:

```bash
# Copy a template
cp -r templates/nextjs my-fhevm-app
cd my-fhevm-app

# Install and run
npm install
npm run dev
```

Available templates:
- **Next.js** - Full-stack with API routes
- **React** - Client-side SPA
- **Vue** - Vue 3 application
- **Node.js** - Backend server

[View all templates →](./templates)

#### Option 2: Install SDK in Existing Project

Add FHEVM SDK to your existing application:

```bash
# Install the SDK
npm install @fhevm/sdk ethers fhevmjs
```

Then follow our [integration guides](./docs/framework-integration.md) for your framework.

#### Option 3: Explore Examples

Run our complete example applications:

```bash
# Clone the repository
git clone https://github.com/HillaryEbert/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Run Next.js example
cd examples/nextjs-demo
npm install && npm run dev    # Open http://localhost:3000

# Run React example
cd examples/react-demo
npm install && npm run dev    # Open http://localhost:3001

# Run Vue example
cd examples/vue-demo
npm install && npm run dev    # Open http://localhost:3002

# Run Quantum Computing app
cd examples/quantum-computing
npm install && npm start
```

### Prerequisites

- **Node.js**: 18 or higher
- **Package Manager**: npm or yarn
- **Wallet**: MetaMask or compatible Web3 wallet
- **Test ETH**: Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### Next Steps

1. **Read the Guide**: Start with [Getting Started](./docs/getting-started.md)
2. **Explore Examples**: Check out [Code Examples](./docs/examples.md)
3. **Learn Best Practices**: Read [Best Practices](./docs/best-practices.md)
4. **Join Community**: Ask questions in GitHub Issues

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

### Comprehensive Guides

Our documentation covers everything from getting started to advanced usage:

#### Core Documentation ([docs/](./docs))
- **[Getting Started](./docs/getting-started.md)** - Quick start guide for all frameworks
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Framework Integration](./docs/framework-integration.md)** - Integration guides for React, Vue, Angular, Svelte, Node.js
- **[Architecture](./docs/architecture.md)** - SDK architecture and design decisions
- **[Examples](./docs/examples.md)** - Code examples and common patterns
- **[Best Practices](./docs/best-practices.md)** - Production guidelines and security
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[Migration Guide](./docs/migration-guide.md)** - Migrating from other libraries

#### SDK Documentation
- **Main README**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)
- **API Reference**: Comprehensive hook and utility documentation
- **Framework Examples**: Next.js, React, Vue integration guides
- **Type Definitions**: Full TypeScript API surface

#### Application Documentation
- **Quantum Computing**: [examples/quantum-computing/README.md](./examples/quantum-computing/README.md)
- **Next.js Example**: [examples/nextjs-demo/README.md](./examples/nextjs-demo/README.md)
- **React Example**: [examples/react-demo/README.md](./examples/react-demo/README.md)
- **Vue Example**: [examples/vue-demo/README.md](./examples/vue-demo/README.md)

### Quick Start Templates ([templates/](./templates))

Ready-to-use templates for rapid development:

- **[Next.js Template](./templates/nextjs/)** - Complete Next.js 14 application with App Router
- **[React Template](./templates/react/)** - React 18 + Vite setup
- **[Vue Template](./templates/vue/)** - Vue 3 with Composition API
- **[Node.js Template](./templates/nodejs/)** - Backend server with FHEVM integration

Each template includes:
- ✅ Pre-configured FHEVM SDK integration
- ✅ Example components and pages
- ✅ TypeScript configuration
- ✅ Build and deployment setup
- ✅ Best practices implementation


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

## 🔗 Quick Links

### Documentation
- **Getting Started**: [Quick Start Guide](./docs/getting-started.md)
- **API Reference**: [Complete API Docs](./docs/api-reference.md)
- **Framework Integration**: [Integration Guides](./docs/framework-integration.md)
- **Examples**: [Code Examples](./docs/examples.md)
- **Best Practices**: [Production Guidelines](./docs/best-practices.md)
- **Troubleshooting**: [Common Issues](./docs/troubleshooting.md)

### Templates
- **Next.js**: [Next.js 14 Template](./templates/nextjs/)
- **React**: [React 18 + Vite Template](./templates/react/)
- **Vue**: [Vue 3 Template](./templates/vue/)
- **Node.js**: [Backend Template](./templates/nodejs/)

### Examples
- **Next.js Demo**: [Full Example](./examples/nextjs-demo)
- **React Demo**: [SPA Example](./examples/react-demo)
- **Vue Demo**: [Vue Example](./examples/vue-demo)
- **Quantum Computing**: [Production App](./examples/quantum-computing)

### Resources
- **GitHub Repository**: [HillaryEbert/fhevm-react-template](https://github.com/HillaryEbert/fhevm-react-template)
- **SDK Package**: [packages/fhevm-sdk](./packages/fhevm-sdk)
- **Video Demos**: demo1.mp4, demo2.mp4, demo3.mp4, demo4.mp4
- **Issue Tracker**: [GitHub Issues](https://github.com/HillaryEbert/fhevm-react-template/issues)

---

## 📖 Learning Resources

### For Beginners
1. Start with [Getting Started Guide](./docs/getting-started.md)
2. Try a [Quick Start Template](./templates)
3. Follow [Code Examples](./docs/examples.md)
4. Join the community and ask questions

### For Advanced Users
1. Review [Architecture Documentation](./docs/architecture.md)
2. Study [Best Practices](./docs/best-practices.md)
3. Explore [Framework Integration](./docs/framework-integration.md)
4. Contribute to the project

### For Contributors
1. Read [Contributing Guidelines](#-contributing)
2. Check [Open Issues](https://github.com/HillaryEbert/fhevm-react-template/issues)
3. Review [Architecture](./docs/architecture.md)
4. Submit Pull Requests

---

<div align="center">

**Built with ❤️ for the FHEVM SDK Competition & Zama Developer Program**

[⭐ Star on GitHub](https://github.com/HillaryEbert/fhevm-react-template) | [📖 Documentation](./docs) | [🚀 Templates](./templates) | [💡 Examples](./examples)

### Support This Project

If you find this SDK useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting features
- 🤝 Contributing code
- 📢 Sharing with others

</div>
