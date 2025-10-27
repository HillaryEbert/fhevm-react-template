# Architecture

Understanding the FHEVM SDK architecture and design decisions.

## Overview

The FHEVM SDK is designed with the following principles:

1. **Framework Agnostic Core**: Core utilities work with any JavaScript framework
2. **React-First Approach**: Comprehensive React integration for common use cases
3. **TypeScript Native**: Full type safety throughout
4. **Modular Design**: Use only what you need
5. **Performance Optimized**: Minimal re-renders and efficient caching

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  (React Components, Vue Components, Angular Services, etc)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Framework Adapters Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ React Hooks  │  │ Vue Compos.  │  │   Angular    │     │
│  │ - useFHEVM   │  │ - useFHEVM   │  │   Services   │     │
│  │ - useContract│  │ - useContract│  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Core SDK Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FHEVM Instance Manager                              │  │
│  │  - Initialization, Configuration, Lifecycle          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Encryption/Decryption Engine                        │  │
│  │  - Type handlers, Validation, Transformation         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Contract Interaction Layer                          │  │
│  │  - Call/Send abstraction, Event handling             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Wallet Connection                                   │  │
│  │  - Provider detection, Account management            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 External Dependencies                       │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐             │
│  │ fhevmjs  │  │  ethers  │  │  Web3       │             │
│  │          │  │          │  │  Provider   │             │
│  └──────────┘  └──────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. FHEVM Instance Manager

Manages the lifecycle of FHEVM instances.

**Responsibilities:**
- Initialize FHEVM with configuration
- Fetch and cache public keys
- Manage connection state
- Handle errors and retries

**Key Files:**
- `src/core/fhevm.ts`
- `src/utils/instance.ts`

### 2. Encryption Engine

Handles all encryption and decryption operations.

**Responsibilities:**
- Type-safe encryption for all supported types
- Input validation
- Output transformation
- Error handling

**Key Files:**
- `src/utils/encryption.ts`
- `src/utils/validation.ts`

### 3. Contract Interaction Layer

Simplifies smart contract interactions.

**Responsibilities:**
- Abstract ethers.js complexity
- Provide simple call/send interface
- Event listener management
- Transaction handling

**Key Files:**
- `src/utils/contract.ts`
- `src/hooks/useContract.ts`

### 4. React Integration

React-specific hooks and providers.

**Responsibilities:**
- React Context for global state
- Custom hooks for FHEVM operations
- State management
- Side effect handling

**Key Files:**
- `src/providers/FHEVMProvider.tsx`
- `src/hooks/useFHEVM.ts`
- `src/hooks/useWallet.ts`
- `src/hooks/useContract.ts`

## Data Flow

### Encryption Flow

```
User Input
    │
    ▼
Validation Layer
    │
    ▼
Type Detection
    │
    ▼
FHEVM Instance
    │
    ▼
Public Key
    │
    ▼
fhevmjs Library
    │
    ▼
Encrypted Data (Uint8Array)
    │
    ▼
Application
```

### Contract Interaction Flow

```
Component
    │
    ▼
useContract Hook
    │
    ▼
Contract Instance (ethers)
    │
    ▼
Provider (Web3)
    │
    ▼
Blockchain
    │
    ▼
Transaction Receipt
    │
    ▼
Component Update
```

## State Management

### React Context Structure

```typescript
interface FHEVMContextValue {
  // State
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  client: FhevmInstance | null;

  // Actions
  init: () => Promise<void>;

  // Encryption methods
  encrypt8: (value: number) => Promise<Uint8Array>;
  encrypt16: (value: number) => Promise<Uint8Array>;
  encrypt32: (value: number) => Promise<Uint8Array>;
  encrypt64: (value: bigint) => Promise<Uint8Array>;
  encrypt128: (value: bigint) => Promise<Uint8Array>;
  encrypt256: (value: bigint) => Promise<Uint8Array>;
  encryptBool: (value: boolean) => Promise<Uint8Array>;
  encryptAddress: (value: string) => Promise<Uint8Array>;
}
```

### State Lifecycle

1. **Uninitialized**: Initial state
2. **Initializing**: Fetching keys, connecting wallet
3. **Initialized**: Ready for encryption
4. **Error**: Initialization failed

## Design Patterns

### 1. Provider Pattern

Global state management using React Context:

```typescript
<FHEVMProvider config={config}>
  <App />
</FHEVMProvider>
```

### 2. Hook Pattern

Encapsulated functionality in custom hooks:

```typescript
const { encrypt64, isInitialized } = useFHEVM();
```

### 3. Factory Pattern

Instance creation with configuration:

```typescript
const instance = await createFhevmInstance(config);
```

### 4. Observer Pattern

Event listening and subscription:

```typescript
const unsubscribe = listen('Event', handler);
```

## Performance Optimizations

### 1. Lazy Initialization

```typescript
// Don't initialize until needed
const { init } = useFHEVM();

// Initialize on user action
await init();
```

### 2. Memoization

```typescript
const config = useMemo(() => ({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
}), []);
```

### 3. Public Key Caching

```typescript
// Cache public key for 1 hour
const cachedKey = localStorage.getItem('fhevm_public_key');
```

### 4. Batching

```typescript
// Batch multiple encryptions
const results = await Promise.all([
  encrypt64(value1),
  encrypt64(value2),
  encrypt64(value3),
]);
```

## Security Considerations

### 1. Input Validation

All inputs are validated before encryption:

```typescript
function validateInput(value: any, type: FHEType): boolean {
  // Type-specific validation
}
```

### 2. Error Handling

Errors are caught and sanitized:

```typescript
try {
  return await encrypt64(value);
} catch (error) {
  console.error('Encryption failed:', error);
  throw new Error('Encryption failed');
}
```

### 3. Secure Storage

Sensitive data is never stored in localStorage:

```typescript
// Only cache public key (non-sensitive)
localStorage.setItem('fhevm_public_key', key);
```

## Extensibility

### Adding New Encryption Types

```typescript
// 1. Add type definition
type FHEType = 'uint8' | 'uint16' | ... | 'newType';

// 2. Add encryption method
async encryptNewType(value: any): Promise<Uint8Array> {
  // Implementation
}

// 3. Add to hook
export function useFHEVM() {
  // ...
  return {
    // ...
    encryptNewType,
  };
}
```

### Adding Framework Support

```typescript
// 1. Create adapter
// adapters/angular.ts
export class FhevmService {
  // Angular-specific implementation
}

// 2. Expose in package
export { FhevmService } from './adapters/angular';
```

## Testing Strategy

### Unit Tests

Test individual functions:

```typescript
describe('encryption', () => {
  it('should encrypt uint64', async () => {
    const result = await encrypt64(BigInt(12345));
    expect(result).toBeInstanceOf(Uint8Array);
  });
});
```

### Integration Tests

Test component integration:

```typescript
describe('EncryptForm', () => {
  it('should encrypt on submit', async () => {
    const { getByText } = render(<EncryptForm />);
    // Test interaction
  });
});
```

### E2E Tests

Test complete flows:

```typescript
describe('Encryption Flow', () => {
  it('should encrypt and store data', async () => {
    // Full user journey
  });
});
```

## Dependencies

### Core Dependencies

- **fhevmjs**: FHE operations
- **ethers**: Blockchain interaction
- **TypeScript**: Type safety

### React Dependencies

- **react**: UI framework
- **react-dom**: React rendering

### Dev Dependencies

- **vite/webpack**: Bundling
- **vitest/jest**: Testing
- **typescript**: Compilation

## Future Enhancements

1. **Web Workers**: Offload encryption to workers
2. **Caching Layer**: Advanced caching strategies
3. **Batch API**: Dedicated batch operations
4. **Plugins System**: Extensible plugin architecture
5. **DevTools**: Browser extension for debugging

## See Also

- [API Reference](./api-reference.md)
- [Best Practices](./best-practices.md)
- [Getting Started](./getting-started.md)
