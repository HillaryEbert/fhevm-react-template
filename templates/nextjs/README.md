# Next.js FHEVM Template

Production-ready Next.js 14 template with FHEVM SDK integration.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ FHEVM SDK pre-configured
- ✅ Example components
- ✅ API routes
- ✅ Responsive design

## Quick Start

```bash
# Copy this template
cp -r templates/nextjs my-app
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

## Project Structure

```
nextjs/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # FHEVM Provider
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       └── fhe/
│           └── route.ts        # FHE operations
├── components/
│   ├── EncryptForm.tsx         # Encryption form
│   └── WalletConnect.tsx       # Wallet button
├── lib/
│   └── constants.ts            # Configuration
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Configuration

### 1. Update Network Settings

Edit `lib/constants.ts`:

```typescript
export const FHEVM_CONFIG = {
  chainId: 11155111,        // Your chain ID
  network: 'sepolia',       // Your network
};

export const CONTRACT_ADDRESS = '0x...'; // Your contract
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_GATEWAY_URL=https://gateway.fhevm.io
```

### 3. Update Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata = {
  title: 'Your App Name',
  description: 'Your description',
};
```

## Components

### EncryptForm

Basic encryption form component:

```typescript
import { useFHEVM } from '@fhevm/sdk/react';

export function EncryptForm() {
  const { encrypt64 } = useFHEVM();

  // Component implementation
}
```

Located in: `components/EncryptForm.tsx`

### WalletConnect

Wallet connection button:

```typescript
import { useWallet } from '@fhevm/sdk/react';

export function WalletConnect() {
  const { connect, disconnect, isConnected } = useWallet();

  // Component implementation
}
```

Located in: `components/WalletConnect.tsx`

## API Routes

### POST /api/fhe

Encryption endpoint:

```typescript
// app/api/fhe/route.ts
export async function POST(request: Request) {
  const { value, type } = await request.json();

  // Server-side encryption logic

  return Response.json({ encrypted });
}
```

## Customization

### Styling

Update `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
};
```

### Add Pages

Create new page:

```bash
# Create app/dashboard/page.tsx
mkdir app/dashboard
touch app/dashboard/page.tsx
```

### Add Components

Create new component:

```bash
# Create components/MyComponent.tsx
touch components/MyComponent.tsx
```

## Build & Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FHEVM SDK Documentation](../../docs)
- [Complete Example](../../examples/nextjs-demo)

## License

MIT
