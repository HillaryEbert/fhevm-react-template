# 🚀 Quick Setup Guide

This guide will help you set up the FHEVM Universal SDK and run the example applications.

## Prerequisites

- Node.js 18+ and npm/pnpm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

## Installation

### Option 1: Using npm (Recommended for beginners)

```bash
# Install all dependencies from root
npm install

# Build the SDK
npm run build
```

### Option 2: Using pnpm (Recommended for monorepos)

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install all dependencies
pnpm install

# Build the SDK
pnpm run build
```

## Running Examples

### Next.js Demo

```bash
cd examples/nextjs-demo
npm install
npm run dev
# Open your browser to the URL shown in terminal (usually http://localhost:3000)
```

### React Demo

```bash
cd examples/react-demo
npm install
npm run dev
# Open your browser to the URL shown in terminal
```

### Vue Demo

```bash
cd examples/vue-demo
npm install
npm run dev
# Open your browser to the URL shown in terminal
```

### Quantum Computing App

```bash
cd examples/quantum-computing
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia (requires PRIVATE_KEY in .env)
npx hardhat run scripts/deploy.js --network sepolia

# Start frontend
npm start
# Open your browser to the URL shown in terminal
```

## Smart Contract Development

### Compile Contracts

From the quantum-computing example:

```bash
cd examples/quantum-computing
npx hardhat compile
```

This will:
- Compile all Solidity contracts in `contracts/`
- Generate ABIs in `artifacts/`
- Copy ABIs to `public/abis/` for frontend use

### Deploy Contracts

1. Create a `.env` file in `examples/quantum-computing/`:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
```

2. Deploy to Sepolia:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Update the contract address in your frontend code.

### Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## Using the SDK in Your Project

### Install from npm (when published)

```bash
npm install @quantum-privacy/fhevm-sdk ethers fhevmjs
```

### Install locally (for development)

```bash
# From your project
npm install ../path/to/fhevm-react-template/packages/fhevm-sdk
```

### Quick Start Code

```typescript
import { FhevmProvider, useWallet, useContract } from '@quantum-privacy/fhevm-sdk';

// Wrap your app with FhevmProvider
function App() {
  return (
    <FhevmProvider config={{ chainId: 11155111 }}>
      <YourApp />
    </FhevmProvider>
  );
}

// Use hooks in components
function YourComponent() {
  const { connect, address, isConnected } = useWallet();
  const { send, call } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
  });

  // Your logic here
}
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Main SDK package
│       ├── src/                # SDK source code
│       ├── package.json
│       └── README.md           # SDK documentation
│
├── examples/
│   ├── nextjs-demo/           # Next.js example
│   ├── react-demo/            # React example
│   ├── vue-demo/              # Vue example
│   └── quantum-computing/     # Full quantum computing app
│       ├── contracts/         # Solidity contracts
│       ├── scripts/           # Deployment scripts
│       └── public/            # Frontend code
│
├── package.json               # Root package.json for workspaces
└── README.md                  # Main documentation
```

## Troubleshooting

### "Module not found" errors

Make sure you've installed all dependencies:
```bash
npm install  # or pnpm install
```

### "Cannot find module '@quantum-privacy/fhevm-sdk'"

Build the SDK first:
```bash
npm run build  # or pnpm run build
```

### Contract deployment fails

1. Check your `.env` file has correct values
2. Ensure you have Sepolia ETH in your account
3. Verify your RPC URL is working

### MetaMask not connecting

1. Make sure MetaMask is installed
2. Check you're on Sepolia testnet (Chain ID: 11155111)
3. Try refreshing the page

## Learn More

- [SDK Documentation](./packages/fhevm-sdk/README.md)
- [Quantum Computing Example](./examples/quantum-computing/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Join the community discussions

---

Happy coding! 🎉
