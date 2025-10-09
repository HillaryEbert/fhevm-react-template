# FHEVM Vue Demo

Vue 3 + Vite demo application using `@quantum-privacy/fhevm-sdk` for encrypted quantum computing on Ethereum.

## Features

- 🔐 **Encrypted Quantum Computing**: Submit and execute quantum algorithms with FHE
- ⚛️ **Quantum State Management**: Initialize and manage quantum states
- 👛 **Wallet Integration**: MetaMask connection with account management
- 📊 **Job Tracking**: Query and monitor quantum computation jobs
- 🎨 **Modern Vue**: Built with Vue 3 Composition API + TypeScript + Vite

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
vue-demo/
├── src/
│   ├── App.vue           # Main application component
│   ├── main.ts           # App entry point
│   └── style.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
└── package.json
```

## Using the SDK with Vue

### 1. Initialize FHEVM Instance

```ts
import { createFhevmInstance } from '@quantum-privacy/fhevm-sdk';
import { onMounted, ref } from 'vue';

const isReady = ref(false);
let fhevmInstance: any = null;

onMounted(async () => {
  fhevmInstance = await createFhevmInstance({ chainId: 11155111 });
  isReady.value = true;
});
```

### 2. Connect to Wallet

```ts
import { ethers } from 'ethers';

const handleConnect = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  // Use signer to interact with contracts
};
```

### 3. Interact with Smart Contracts

```ts
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
);

// Send transaction
const tx = await contract.submitQuantumJob(value, algorithmType);
await tx.wait();

// Query data
const info = await contract.getJobInfo(jobId);
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
- [React Demo](../react-demo/README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## Smart Contract

**QuantumPrivacyCompute**: `0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2` (Sepolia)

## License

MIT
