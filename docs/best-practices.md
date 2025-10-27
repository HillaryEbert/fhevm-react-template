# Best Practices

Guidelines and recommendations for using the FHEVM SDK in production applications.

## Security

### 1. Input Validation

Always validate user input before encryption:

```typescript
function validateValue(value: string, type: FHEType): boolean {
  try {
    switch (type) {
      case 'uint8':
        const num = Number(value);
        return num >= 0 && num <= 255 && Number.isInteger(num);
      case 'uint64':
        const bigNum = BigInt(value);
        return bigNum >= 0n;
      case 'address':
        return /^0x[a-fA-F0-9]{40}$/.test(value);
      default:
        return false;
    }
  } catch {
    return false;
  }
}

// Usage
if (!validateValue(userInput, 'uint64')) {
  throw new Error('Invalid input');
}
const encrypted = await encrypt64(BigInt(userInput));
```

### 2. Error Handling

Implement comprehensive error handling:

```typescript
async function safeEncrypt(value: bigint) {
  try {
    if (!isInitialized) {
      throw new Error('FHEVM not initialized');
    }

    const encrypted = await encrypt64(value);
    return { success: true, data: encrypted };
  } catch (error) {
    console.error('Encryption error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### 3. Rate Limiting

Implement rate limiting for encryption operations:

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>();

  check(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(
      time => now - time < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }
}

// Usage
const limiter = new RateLimiter();

async function encrypt(value: bigint, userId: string) {
  if (!limiter.check(userId, 10, 60000)) {
    throw new Error('Rate limit exceeded');
  }
  return await encrypt64(value);
}
```

## Performance

### 1. Lazy Initialization

Initialize FHEVM only when needed:

```typescript
const { init, isInitialized } = useFHEVM();

// Manual initialization
const handleConnect = async () => {
  if (!isInitialized) {
    await init();
  }
};
```

### 2. Memoization

Memoize expensive operations:

```typescript
import { useMemo } from 'react';

function MyComponent() {
  const contractConfig = useMemo(
    () => ({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
    }),
    []
  );

  const { call, send } = useContract(contractConfig);

  // Component logic
}
```

### 3. Batch Operations

Batch multiple encryptions when possible:

```typescript
async function encryptBatch(values: bigint[]) {
  const promises = values.map(value => encrypt64(value));
  return Promise.all(promises);
}

// Usage
const encrypted = await encryptBatch([100n, 200n, 300n]);
```

## State Management

### 1. Centralized State

Use a centralized state for FHEVM:

```typescript
// store/fhevm.ts
import { create } from 'zustand';

interface FhevmStore {
  isInitialized: boolean;
  error: Error | null;
  setInitialized: (value: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useFhevmStore = create<FhevmStore>((set) => ({
  isInitialized: false,
  error: null,
  setInitialized: (value) => set({ isInitialized: value }),
  setError: (error) => set({ error }),
}));
```

### 2. Persistent Storage

Cache public keys and configuration:

```typescript
const KEY_STORAGE_KEY = 'fhevm_public_key';
const KEY_EXPIRY_MS = 3600000; // 1 hour

function cachePublicKey(key: string) {
  const data = {
    key,
    timestamp: Date.now(),
  };
  localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(data));
}

function getCachedPublicKey(): string | null {
  const cached = localStorage.getItem(KEY_STORAGE_KEY);
  if (!cached) return null;

  const { key, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > KEY_EXPIRY_MS) {
    localStorage.removeItem(KEY_STORAGE_KEY);
    return null;
  }

  return key;
}
```

## User Experience

### 1. Loading States

Always show loading states:

```typescript
function EncryptButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEncrypt = async () => {
    setIsLoading(true);
    try {
      await encrypt64(BigInt(value));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button disabled={isLoading} onClick={handleEncrypt}>
      {isLoading ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### 2. User Feedback

Provide clear feedback for all operations:

```typescript
function EncryptDemo() {
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleEncrypt = async () => {
    setStatus({ type: 'loading' });
    try {
      await encrypt64(BigInt(value));
      setStatus({
        type: 'success',
        message: 'Encryption successful!',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    }
  };

  return (
    <div>
      {status.type === 'loading' && <Spinner />}
      {status.type === 'success' && (
        <SuccessMessage>{status.message}</SuccessMessage>
      )}
      {status.type === 'error' && (
        <ErrorMessage>{status.message}</ErrorMessage>
      )}
    </div>
  );
}
```

### 3. Progressive Enhancement

Build with progressive enhancement:

```typescript
function EncryptForm() {
  const { isInitialized } = useFHEVM();
  const [supportsWallet, setSupportsWallet] = useState(false);

  useEffect(() => {
    setSupportsWallet(typeof window.ethereum !== 'undefined');
  }, []);

  if (!supportsWallet) {
    return (
      <div>
        <p>Please install MetaMask to use this feature.</p>
        <a href="https://metamask.io">Install MetaMask</a>
      </div>
    );
  }

  if (!isInitialized) {
    return <InitializeButton />;
  }

  return <EncryptionForm />;
}
```

## Code Organization

### 1. Separation of Concerns

Separate business logic from UI:

```typescript
// hooks/useEncryption.ts
export function useEncryption() {
  const { encrypt64 } = useFHEVM();
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = async (value: bigint) => {
    try {
      const encrypted = await encrypt64(value);
      setResult(encrypted);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setResult(null);
    }
  };

  return { encrypt, result, error };
}

// components/EncryptForm.tsx
function EncryptForm() {
  const { encrypt, result, error } = useEncryption();

  return (
    <div>
      {/* UI only */}
    </div>
  );
}
```

### 2. Reusable Components

Create reusable components:

```typescript
// components/EncryptedInput.tsx
interface EncryptedInputProps {
  onEncrypt: (encrypted: Uint8Array) => void;
  type: FHEType;
}

export function EncryptedInput({ onEncrypt, type }: EncryptedInputProps) {
  const { encrypt64 } = useFHEVM();
  const [value, setValue] = useState('');

  const handleEncrypt = async () => {
    const encrypted = await encrypt64(BigInt(value));
    onEncrypt(encrypted);
  };

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleEncrypt}>Encrypt</button>
    </div>
  );
}
```

## Testing

### 1. Unit Tests

Test encryption logic:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { createFhevmInstance } from '@fhevm/sdk';

describe('FHEVM Encryption', () => {
  let fhevm: any;

  beforeAll(async () => {
    fhevm = await createFhevmInstance({
      chainId: 11155111,
      network: 'sepolia',
    });
  });

  it('should encrypt uint64', async () => {
    const encrypted = await fhevm.encrypt64(BigInt(12345));
    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should throw on invalid input', async () => {
    await expect(fhevm.encrypt64('invalid')).rejects.toThrow();
  });
});
```

### 2. Integration Tests

Test component integration:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { FHEVMProvider } from '@fhevm/sdk/react';
import { EncryptDemo } from './EncryptDemo';

describe('EncryptDemo', () => {
  it('should encrypt value', async () => {
    render(
      <FHEVMProvider config={{ chainId: 11155111 }}>
        <EncryptDemo />
      </FHEVMProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Encrypt')).toBeEnabled();
    });

    // Test encryption flow
  });
});
```

## TypeScript

### 1. Strict Types

Enable strict TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Type Guards

Use type guards for safety:

```typescript
function isValidEncryptedData(data: any): data is Uint8Array {
  return data instanceof Uint8Array && data.length > 0;
}

// Usage
if (isValidEncryptedData(result)) {
  // TypeScript knows result is Uint8Array
  console.log(result.length);
}
```

## Deployment

### 1. Environment Variables

Use environment variables:

```typescript
const config = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  network: process.env.NEXT_PUBLIC_NETWORK,
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
};
```

### 2. Error Boundaries

Implement error boundaries:

```typescript
class FhevmErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('FHEVM Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>;
    }

    return this.props.children;
  }
}

// Usage
<FhevmErrorBoundary>
  <YourApp />
</FhevmErrorBoundary>
```

### 3. Monitoring

Add monitoring and analytics:

```typescript
async function monitoredEncrypt(value: bigint) {
  const startTime = Date.now();
  try {
    const result = await encrypt64(value);

    // Log success metrics
    analytics.track('encryption_success', {
      duration: Date.now() - startTime,
      type: 'uint64',
    });

    return result;
  } catch (error) {
    // Log error metrics
    analytics.track('encryption_error', {
      duration: Date.now() - startTime,
      error: error.message,
    });
    throw error;
  }
}
```

## Summary

Key best practices:

1. ✅ Validate all inputs before encryption
2. ✅ Implement comprehensive error handling
3. ✅ Use loading states for better UX
4. ✅ Memoize expensive operations
5. ✅ Separate business logic from UI
6. ✅ Write tests for critical paths
7. ✅ Use TypeScript for type safety
8. ✅ Implement proper error boundaries
9. ✅ Monitor production usage
10. ✅ Cache public keys appropriately

## See Also

- [API Reference](./api-reference.md)
- [Examples](./examples.md)
- [Troubleshooting](./troubleshooting.md)
