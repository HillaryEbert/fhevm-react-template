# Next.js FHEVM SDK Example

A comprehensive demonstration of the FHEVM SDK integrated with Next.js 14, showcasing encrypted blockchain applications using Zama's Fully Homomorphic Encryption technology.

## Features

- **Complete SDK Integration**: Full demonstration of SDK hooks and utilities
- **Modern Next.js 14**: Uses App Router, Server Components, and API Routes
- **TypeScript**: Full type safety with comprehensive type definitions
- **Responsive UI**: Beautiful, modern interface with Tailwind CSS
- **Multiple Examples**: Banking, healthcare, and computation demonstrations
- **API Routes**: Server-side FHE operations and key management

## Project Structure

```
nextjs-demo/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── providers.tsx              # FHE Provider setup
│   ├── api/                       # API Routes
│   │   ├── fhe/
│   │   │   ├── route.ts           # FHE operations
│   │   │   ├── encrypt/route.ts   # Encryption API
│   │   │   ├── decrypt/route.ts   # Decryption API
│   │   │   └── compute/route.ts   # Computation API
│   │   └── keys/route.ts          # Key management
│   └── components/
│       ├── ui/                    # UI Components
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   └── Card.tsx
│       ├── fhe/                   # FHE Components
│       │   ├── FHEProvider.tsx
│       │   ├── EncryptionDemo.tsx
│       │   ├── ComputationDemo.tsx
│       │   └── KeyManager.tsx
│       ├── examples/              # Use Cases
│       │   ├── BankingExample.tsx
│       │   └── MedicalExample.tsx
│       ├── StatusBar.tsx
│       ├── EncryptionDemo.tsx
│       └── ContractInteraction.tsx
├── lib/
│   ├── fhe/                       # FHE Library
│   │   ├── client.ts              # Client-side operations
│   │   ├── server.ts              # Server-side operations
│   │   ├── keys.ts                # Key management
│   │   └── types.ts               # FHE type definitions
│   └── utils/                     # Utilities
│       ├── security.ts            # Security helpers
│       └── validation.ts          # Validation functions
├── hooks/                         # Custom Hooks
│   ├── useFHE.ts                  # FHE operations hook
│   ├── useEncryption.ts           # Encryption hook
│   └── useComputation.ts          # Computation hook
├── types/                         # TypeScript Types
│   ├── fhe.ts                     # FHE types
│   └── api.ts                     # API types
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH

### Installation

1. Navigate to the example directory:

```bash
cd examples/nextjs-demo
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## SDK Usage Examples

### 1. Provider Setup

Wrap your app with the FHEVMProvider:

```typescript
import { FHEVMProvider } from '@fhevm/sdk/react';

export function Providers({ children }) {
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

### 2. Using Hooks

```typescript
import { useFHEVM } from '@fhevm/sdk/react';

function MyComponent() {
  const { isInitialized, encrypt64, encrypt32, error } = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await encrypt64(BigInt(12345));
    // Use encrypted data
  };

  return (
    // Your UI
  );
}
```

### 3. Contract Interaction

```typescript
import { useContract } from '@fhevm/sdk/react';

function ContractDemo() {
  const { call, send, listen } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  // Call view functions
  const data = await call('getData', dataId);

  // Send transactions
  const tx = await send('storeData', encryptedData);

  // Listen to events
  listen('DataStored', (dataId, owner, event) => {
    console.log('New data stored:', dataId);
  });
}
```

## Features Demonstrated

### Encryption Demo
- Support for all FHE types (uint8/16/32/64/128/256, bool, address)
- Real-time encryption with visual feedback
- Type-specific validation and range checking

### Contract Interaction
- Store encrypted data on-chain
- Request decryption via KMS
- Query data information
- Event listening and real-time updates

### Computation Demo
- Homomorphic operations (add, subtract, multiply)
- Encrypted input processing
- Result visualization

### Banking Example
- Private balance management
- Encrypted deposits and withdrawals
- Transaction history with privacy

### Medical Records Example
- Compliant data encryption
- Health metrics tracking
- Audit trail and access control

## Build and Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

## Configuration

Update the contract address in `app/components/ContractInteraction.tsx`:

```typescript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - see LICENSE file for details
