# FHEVM Next.js Demo

A Next.js application demonstrating the use of `@quantum-privacy/fhevm-sdk` for confidential smart contract interactions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Open your browser to the URL shown in the terminal
```

## 📦 Features

- ✅ Next.js 14 App Router
- ✅ @quantum-privacy/fhevm-sdk integration
- ✅ TypeScript support
- ✅ Wallet connection
- ✅ Quantum job submission
- ✅ Job query functionality

## 🏗️ Project Structure

```
nextjs-demo/
├── app/
│   ├── layout.tsx       # Root layout with FhevmProvider
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── package.json
└── README.md
```

## 💡 Usage

### 1. Setup Provider

The app is wrapped with `FhevmProvider` in `app/layout.tsx`:

```tsx
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={{ chainId: 11155111 }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### 2. Use Hooks

In your components, use the SDK hooks:

```tsx
import { useWallet, useContract } from '@quantum-privacy/fhevm-sdk';

function MyComponent() {
  const { connect, address, isConnected } = useWallet();
  const { send } = useContract({ address: CONTRACT_ADDRESS, abi: ABI });

  return (
    <button onClick={connect}>
      {isConnected ? address : 'Connect'}
    </button>
  );
}
```

## 📚 SDK Hooks Used

- `useWallet()` - Wallet connection and management
- `useEncrypt()` - Data encryption
- `useContract()` - Smart contract interaction

## 🌐 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Build for Production

```bash
npm run build
npm start
```

## 🔗 Links

- [SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Main Repository](../..)
- [Quantum Computing Demo](../quantum-computing)

---

Built with ❤️ using @quantum-privacy/fhevm-sdk
