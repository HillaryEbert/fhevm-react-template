# Quantum Computing FHEVM - Vite + React Version

This is a modern Vite + React implementation of the Quantum Computing FHEVM application, fully integrated with the `@quantum-privacy/fhevm-sdk`.

## Features

✅ **Vite + React 18** - Fast HMR and optimized builds
✅ **FHEVM SDK Integration** - Full SDK integration with hooks
✅ **TypeScript** - Type-safe development
✅ **Modern UI Components** - Modular React components
✅ **Quantum Algorithms** - 6 quantum algorithms implementation
✅ **Smart Contract Integration** - Direct blockchain interaction

## Project Structure

```
quantum-computing/
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # App header
│   │   ├── WalletSection.tsx          # Wallet connection
│   │   ├── QuantumStateSection.tsx    # Quantum state initialization
│   │   ├── AlgorithmSection.tsx       # Algorithm selection & submission
│   │   └── JobSection.tsx             # Job status queries
│   ├── App.tsx                        # Main app component
│   ├── main.tsx                       # Entry point with SDK provider
│   └── index.css                      # Global styles
├── contracts/                         # Smart contracts
├── scripts/                           # Deployment scripts
├── index.html                         # Vite entry HTML
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript config
└── package.json                       # Dependencies

Old HTML version: index-old.html (preserved for reference)
```

## Installation

```bash
# Install dependencies
npm install

# Or if using the root workspace
cd ../../
npm install
```

## Development

```bash
# Start dev server (runs on port 3003)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy
```

## SDK Usage

This application demonstrates full integration of the `@quantum-privacy/fhevm-sdk`:

### 1. Provider Setup (main.tsx)

```typescript
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';

<FhevmProvider config={{ chainId: 11155111 }}>
  <App />
</FhevmProvider>
```

### 2. Hooks Usage (App.tsx)

```typescript
import { useFhevm, useWallet, useContract } from '@quantum-privacy/fhevm-sdk';

const { isReady } = useFhevm();
const { address, isConnected, connect, disconnect } = useWallet();
const { send, call } = useContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
});
```

### 3. Contract Interactions

**Initialize Quantum State:**
```typescript
const tx = await send('initializeQuantumState', [amplitudes, qubitCount]);
await tx.wait();
```

**Submit Quantum Job:**
```typescript
const tx = await send('submitQuantumJob', [inputValue, algorithmType]);
await tx.wait();
```

**Query Job Status:**
```typescript
const info = await call('getJobInfo', [jobId]);
```

## Available Quantum Algorithms

1. **Shor's Algorithm** - Integer factorization
2. **Grover's Search** - Unstructured search
3. **VQE** - Variational Quantum Eigensolver
4. **QAOA** - Quantum Approximate Optimization
5. **Quantum ML** - Quantum Machine Learning
6. **Custom Circuit** - User-defined quantum operations

## Requirements

- Node.js 18+
- MetaMask wallet
- Sepolia testnet ETH

## Contract Address

The application uses a deployed contract on Sepolia testnet:
- Address: `0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2`

## Benefits of Vite Version

1. **⚡ Fast Development** - Lightning-fast HMR with Vite
2. **📦 Smaller Bundle** - Optimized production builds
3. **🔧 Better DX** - Modern tooling and TypeScript support
4. **🧩 Modular** - Component-based architecture
5. **🎨 Maintainable** - Separated concerns with proper structure
6. **✅ Type Safe** - Full TypeScript coverage

## Migration from Old Version

The old HTML/JavaScript version has been preserved as `index-old.html`. The new Vite version provides:

- Better code organization
- Type safety with TypeScript
- Component reusability
- Modern build tooling
- SDK integration instead of direct ethers.js calls

## Troubleshooting

**Port already in use:**
```bash
# Change port in vite.config.ts or use different port
npm run dev -- --port 3004
```

**SDK not found:**
```bash
# Rebuild SDK
cd ../../packages/fhevm-sdk
npm install && npm run build
```

**MetaMask connection issues:**
- Ensure you're on Sepolia testnet
- Check that MetaMask is installed and unlocked
- Refresh the page after connecting

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)
