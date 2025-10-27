# React FHEVM Template

Lightweight React template with FHEVM SDK integration using Vite.

## Features

- ✅ React 18
- ✅ Vite for fast development
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ FHEVM SDK pre-configured
- ✅ React Router
- ✅ Example components

## Quick Start

```bash
# Copy this template
cp -r templates/react my-app
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

## Project Structure

```
react/
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Main app component
│   ├── components/
│   │   ├── EncryptForm.tsx     # Encryption form
│   │   └── WalletConnect.tsx   # Wallet button
│   ├── hooks/
│   │   └── useFHEVM.ts         # Custom hooks
│   ├── lib/
│   │   └── constants.ts        # Configuration
│   └── styles/
│       └── index.css           # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Configuration

### 1. Update Settings

Edit `src/lib/constants.ts`:

```typescript
export const FHEVM_CONFIG = {
  chainId: 11155111,
  network: 'sepolia',
};
```

### 2. Environment Variables

Create `.env`:

```env
VITE_CHAIN_ID=11155111
VITE_NETWORK=sepolia
```

## Components

### App Component

Main application wrapper:

```typescript
import { FHEVMProvider } from '@fhevm/sdk/react';
import { FHEVM_CONFIG } from './lib/constants';

function App() {
  return (
    <FHEVMProvider config={FHEVM_CONFIG}>
      {/* Your app */}
    </FHEVMProvider>
  );
}
```

### EncryptForm

Encryption form component with state management.

### WalletConnect

Wallet connection button with status display.

## Customization

### Add Routes

Install and configure React Router:

```bash
npm install react-router-dom
```

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encrypt" element={<Encrypt />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Styling

Update `tailwind.config.ts` for custom theme.

## Build & Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Deploy

**Vercel:**
```bash
vercel deploy
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [FHEVM SDK Documentation](../../docs)
- [Complete Example](../../examples/react-demo)

## License

MIT
