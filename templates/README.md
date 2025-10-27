# FHEVM SDK Templates

Quick-start templates for different frameworks and use cases.

## Available Templates

- **[Next.js Template](./nextjs/)** - Complete Next.js 14 application with App Router
- **[React Template](./react/)** - React 18 + Vite setup
- **[Vue Template](./vue/)** - Vue 3 with Composition API
- **[Node.js Template](./nodejs/)** - Backend server with FHEVM integration

## Quick Start

### Option 1: Clone and Customize

```bash
# Copy template to your project
cp -r templates/nextjs my-fhevm-app
cd my-fhevm-app

# Install dependencies
npm install

# Start development
npm run dev
```

### Option 2: Use as Reference

Browse the templates to understand how to structure your FHEVM application, then copy specific files or patterns you need.

## Template Structure

Each template includes:

- ✅ Pre-configured FHEVM SDK integration
- ✅ Example components and pages
- ✅ TypeScript configuration
- ✅ Build and deployment setup
- ✅ Best practices implementation
- ✅ Comprehensive README

## Customization Guide

### 1. Update Configuration

```typescript
// Update chain ID and network
const config = {
  chainId: YOUR_CHAIN_ID,
  network: 'YOUR_NETWORK',
};
```

### 2. Replace Contract Address

```typescript
// Update with your deployed contract
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
```

### 3. Customize Styling

Each template uses Tailwind CSS. Update `tailwind.config.ts` to match your brand:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#YOUR_COLOR',
      },
    },
  },
};
```

### 4. Add Your Features

Templates provide a foundation. Add your specific features:

- Custom encryption workflows
- Additional smart contract interactions
- Your business logic
- UI components

## Template Features

### Next.js Template

- ✅ Next.js 14 with App Router
- ✅ Server-side rendering
- ✅ API routes for backend operations
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Example components

**Best for:** Full-stack applications, SEO-friendly sites

### React Template

- ✅ React 18
- ✅ Vite for fast builds
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Client-side routing

**Best for:** SPAs, client-focused applications

### Vue Template

- ✅ Vue 3
- ✅ Composition API
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Vue Router

**Best for:** Vue ecosystem projects

### Node.js Template

- ✅ Express server
- ✅ TypeScript
- ✅ API endpoints
- ✅ FHEVM integration

**Best for:** Backend services, APIs

## Common Patterns

### 1. Basic Encryption

```typescript
import { useFHEVM } from '@fhevm/sdk/react';

function EncryptDemo() {
  const { encrypt64, isInitialized } = useFHEVM();

  const handleEncrypt = async (value: bigint) => {
    if (!isInitialized) return;
    return await encrypt64(value);
  };

  return <div>{/* Your UI */}</div>;
}
```

### 2. Contract Interaction

```typescript
import { useContract } from '@fhevm/sdk/react';

function ContractDemo() {
  const { send, call } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const storeData = async (encrypted: Uint8Array) => {
    const tx = await send('store', encrypted);
    await tx.wait();
  };

  return <div>{/* Your UI */}</div>;
}
```

### 3. Event Listening

```typescript
import { useContract } from '@fhevm/sdk/react';
import { useEffect } from 'react';

function EventDemo() {
  const { listen } = useContract({ address, abi });

  useEffect(() => {
    const unsubscribe = listen('DataStored', (id, owner) => {
      console.log('Data stored:', id, owner);
    });

    return () => unsubscribe();
  }, []);

  return <div>{/* Your UI */}</div>;
}
```

## Deployment

### Vercel (Next.js/React)

```bash
npm install -g vercel
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Support

- **Documentation**: [../docs](../docs)
- **Examples**: [../examples](../examples)
- **Issues**: [GitHub Issues](https://github.com/HillaryEbert/fhevm-react-template/issues)

## Contributing

Want to add a template?

1. Create a new directory with your template
2. Include a comprehensive README
3. Follow existing template structure
4. Add to this index
5. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) for details
