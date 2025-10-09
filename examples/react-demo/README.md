# FHEVM React Demo

React + Vite demo application using `@quantum-privacy/fhevm-sdk` for encrypted quantum computing on Ethereum.

## Features

- 🔐 **Encrypted Quantum Computing**: Submit and execute quantum algorithms with FHE
- ⚛️ **Quantum State Management**: Initialize and manage quantum states
- 👛 **Wallet Integration**: MetaMask connection with account management
- 📊 **Job Tracking**: Query and monitor quantum computation jobs
- 🎨 **Modern React**: Built with React 18 + TypeScript + Vite

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open your browser to the URL shown in the terminal.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
react-demo/
├── src/
│   ├── App.tsx           # Main application component
│   ├── App.css           # Component styles
│   ├── main.tsx          # App entry point with FhevmProvider
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
└── package.json
```

## Using the SDK

### 1. Wrap Your App with FhevmProvider

```tsx
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FhevmProvider config={{ chainId: 11155111 }}>
      <App />
    </FhevmProvider>
  </React.StrictMode>
);
```

### 2. Use SDK Hooks in Components

```tsx
import { useWallet, useContract, useFhevm } from '@quantum-privacy/fhevm-sdk';

function App() {
  const { isReady } = useFhevm();
  const { connect, address, isConnected } = useWallet();
  const { send, call } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  // Your application logic here
}
```

## Available Algorithms

- **Shor's Algorithm**: Integer factorization
- **Grover's Search**: Quantum search algorithm
- **VQE**: Variational Quantum Eigensolver
- **QAOA**: Quantum Approximate Optimization Algorithm
- **Quantum ML**: Machine learning circuits
- **Custom Circuit**: User-defined quantum circuits

## Learn More

- [SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Quantum Computing Example](../quantum-computing/README.md)
- [Next.js Demo](../nextjs-demo/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## Smart Contract

**QuantumPrivacyCompute**: `0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2` (Sepolia)

## License

MIT
