# Migration Guide

Guide for migrating to the FHEVM SDK from other libraries or older versions.

## Migrating from fhevmjs Directly

If you're currently using fhevmjs directly, this SDK provides a higher-level abstraction.

### Before (fhevmjs)

```typescript
import { createInstance } from 'fhevmjs';
import { ethers } from 'ethers';

// Manual setup
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Create instance
const instance = await createInstance({
  chainId: 11155111,
  publicKey: 'YOUR_PUBLIC_KEY',
});

// Encrypt manually
const encrypted = instance.encrypt64(BigInt(12345));

// Manual contract interaction
const contract = new ethers.Contract(address, abi, signer);
await contract.storeValue(encrypted);
```

### After (FHEVM SDK)

```typescript
import { FHEVMProvider, useFHEVM, useContract } from '@fhevm/sdk/react';

// Provider setup (once)
<FHEVMProvider config={{ chainId: 11155111 }}>
  <App />
</FHEVMProvider>

// In component
function MyComponent() {
  const { encrypt64 } = useFHEVM();
  const { send } = useContract({ address, abi });

  const handleStore = async () => {
    const encrypted = await encrypt64(BigInt(12345));
    await send('storeValue', encrypted);
  };
}
```

### Key Benefits

- ✅ Automatic wallet connection
- ✅ Built-in state management
- ✅ Public key fetching and caching
- ✅ TypeScript support
- ✅ Error handling
- ✅ React hooks integration

## Migrating from Custom Implementation

### Before (Custom)

```typescript
// Custom state management
const [fhevmInstance, setFhevmInstance] = useState(null);
const [isReady, setIsReady] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  async function init() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const response = await fetch('https://gateway.fhevm.io/key');
      const { publicKey } = await response.json();

      const instance = await createInstance({
        chainId: 11155111,
        publicKey,
      });

      setFhevmInstance(instance);
      setIsReady(true);
    } catch (err) {
      setError(err);
    }
  }

  init();
}, []);

// Manual encryption
const handleEncrypt = async () => {
  if (!isReady) return;
  const encrypted = fhevmInstance.encrypt64(BigInt(value));
};
```

### After (FHEVM SDK)

```typescript
import { useFHEVM } from '@fhevm/sdk/react';

function MyComponent() {
  const { encrypt64, isInitialized, error } = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await encrypt64(BigInt(value));
  };

  if (!isInitialized) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### What SDK Handles

- ✅ Wallet connection and management
- ✅ Public key fetching and caching
- ✅ Instance initialization
- ✅ Error state management
- ✅ Loading states
- ✅ React Context integration

## Version Migration

### From v0.x to v1.x

#### Breaking Changes

1. **Import paths changed:**

```typescript
// v0.x
import { useFhevm } from '@fhevm/sdk';

// v1.x
import { useFHEVM } from '@fhevm/sdk/react';
```

2. **Config structure changed:**

```typescript
// v0.x
<FhevmProvider chainId={11155111} network="sepolia">

// v1.x
<FHEVMProvider config={{ chainId: 11155111, network: 'sepolia' }}>
```

3. **Hook return values changed:**

```typescript
// v0.x
const { fhevm, ready } = useFhevm();

// v1.x
const { client, isInitialized } = useFHEVM();
```

#### Migration Steps

1. **Update imports:**

```bash
# Find and replace in your project
useFhevm -> useFHEVM
@fhevm/sdk -> @fhevm/sdk/react
FhevmProvider -> FHEVMProvider
```

2. **Update config:**

```typescript
// Old
<FhevmProvider chainId={11155111} network="sepolia">

// New
<FHEVMProvider
  config={{
    chainId: 11155111,
    network: 'sepolia',
    autoInit: true, // New option
  }}
>
```

3. **Update hook usage:**

```typescript
// Old
const { fhevm, ready, error } = useFhevm();
if (ready) {
  const encrypted = fhevm.encrypt64(value);
}

// New
const { encrypt64, isInitialized, error } = useFHEVM();
if (isInitialized) {
  const encrypted = await encrypt64(value);
}
```

4. **Update contract hooks:**

```typescript
// Old
const contract = useContract(address, abi);
await contract.methods.storeValue(encrypted);

// New
const { send } = useContract({ address, abi });
await send('storeValue', encrypted);
```

## Framework Migration

### From React to Vue

#### React Version

```typescript
import { FHEVMProvider, useFHEVM } from '@fhevm/sdk/react';

<FHEVMProvider config={{ chainId: 11155111 }}>
  <App />
</FHEVMProvider>

function MyComponent() {
  const { encrypt64, isInitialized } = useFHEVM();
  // ...
}
```

#### Vue Equivalent

```typescript
// composables/useFHEVM.ts
import { ref, onMounted } from 'vue';
import { createFhevmInstance } from '@fhevm/sdk';

export function useFHEVM() {
  const instance = ref(null);
  const isInitialized = ref(false);

  onMounted(async () => {
    instance.value = await createFhevmInstance({ chainId: 11155111 });
    isInitialized.value = true;
  });

  const encrypt64 = async (value: bigint) => {
    return instance.value.encrypt64(value);
  };

  return { encrypt64, isInitialized };
}

// In component
import { useFHEVM } from '@/composables/useFHEVM';

const { encrypt64, isInitialized } = useFHEVM();
```

### From Vue to Angular

#### Vue Version

```typescript
const { encrypt64 } = useFHEVM();
await encrypt64(BigInt(12345));
```

#### Angular Equivalent

```typescript
// fhevm.service.ts
import { Injectable } from '@angular/core';
import { createFhevmInstance } from '@fhevm/sdk';

@Injectable({ providedIn: 'root' })
export class FhevmService {
  private instance: any;

  async init() {
    this.instance = await createFhevmInstance({ chainId: 11155111 });
  }

  async encrypt64(value: bigint) {
    return this.instance.encrypt64(value);
  }
}

// In component
constructor(private fhevmService: FhevmService) {}

async ngOnInit() {
  await this.fhevmService.init();
}

async encrypt() {
  await this.fhevmService.encrypt64(BigInt(12345));
}
```

## Common Migration Issues

### Issue 1: Provider Not Found

**Error:**
```
Error: useFHEVM must be used within FHEVMProvider
```

**Solution:**

Ensure your app is wrapped with the provider:

```typescript
// index.tsx or main.tsx
import { FHEVMProvider } from '@fhevm/sdk/react';

root.render(
  <FHEVMProvider config={{ chainId: 11155111 }}>
    <App />
  </FHEVMProvider>
);
```

### Issue 2: TypeScript Errors

**Error:**
```
Type 'number' is not assignable to type 'bigint'
```

**Solution:**

Use BigInt for uint64 and above:

```typescript
// Old
encrypt64(12345)

// New
encrypt64(BigInt(12345))
```

### Issue 3: Async/Await

**Error:**
```
Cannot read property of undefined
```

**Solution:**

All encryption methods are now async:

```typescript
// Old
const encrypted = encrypt64(value);

// New
const encrypted = await encrypt64(value);
```

### Issue 4: Contract Methods

**Error:**
```
send is not a function
```

**Solution:**

Use new contract API:

```typescript
// Old
const contract = useContract(address, abi);
await contract.storeValue(encrypted);

// New
const { send } = useContract({ address, abi });
await send('storeValue', encrypted);
```

## Migration Checklist

Use this checklist to ensure complete migration:

- [ ] Update package.json dependencies
- [ ] Update import statements
- [ ] Add FHEVMProvider to app root
- [ ] Update hook usage
- [ ] Convert to async/await
- [ ] Update BigInt usage
- [ ] Update contract interaction
- [ ] Update event listeners
- [ ] Update TypeScript types
- [ ] Update error handling
- [ ] Test all encryption flows
- [ ] Test contract interactions
- [ ] Update documentation
- [ ] Update tests

## Need Help?

If you encounter issues during migration:

1. **Check Documentation**: [Getting Started](./getting-started.md)
2. **Review Examples**: [Examples](./examples.md)
3. **Search Issues**: [GitHub Issues](https://github.com/HillaryEbert/fhevm-react-template/issues)
4. **Create Issue**: Include error messages and code snippets

## See Also

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Examples](./examples.md)
- [Troubleshooting](./troubleshooting.md)
