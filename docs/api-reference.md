# API Reference

Complete API documentation for the FHEVM SDK.

## Table of Contents

- [React Hooks](#react-hooks)
- [Core Functions](#core-functions)
- [Types](#types)
- [Provider](#provider)

## React Hooks

### useFHEVM

Main hook for accessing FHEVM functionality.

```typescript
const {
  isInitialized,
  isInitializing,
  error,
  init,
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encrypt128,
  encrypt256,
  encryptBool,
  encryptAddress,
  client,
} = useFHEVM();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isInitialized` | `boolean` | Whether FHEVM is ready to use |
| `isInitializing` | `boolean` | Whether FHEVM is currently initializing |
| `error` | `Error \| null` | Any initialization error |
| `init` | `() => Promise<void>` | Manually initialize FHEVM |
| `encrypt8` | `(value: number) => Promise<Uint8Array>` | Encrypt uint8 |
| `encrypt16` | `(value: number) => Promise<Uint8Array>` | Encrypt uint16 |
| `encrypt32` | `(value: number) => Promise<Uint8Array>` | Encrypt uint32 |
| `encrypt64` | `(value: bigint) => Promise<Uint8Array>` | Encrypt uint64 |
| `encrypt128` | `(value: bigint) => Promise<Uint8Array>` | Encrypt uint128 |
| `encrypt256` | `(value: bigint) => Promise<Uint8Array>` | Encrypt uint256 |
| `encryptBool` | `(value: boolean) => Promise<Uint8Array>` | Encrypt boolean |
| `encryptAddress` | `(value: string) => Promise<Uint8Array>` | Encrypt address |
| `client` | `FhevmInstance \| null` | Raw FHEVM instance |

#### Example

```typescript
function MyComponent() {
  const { isInitialized, encrypt64, error } = useFHEVM();

  const handleEncrypt = async () => {
    if (!isInitialized) return;

    const encrypted = await encrypt64(BigInt(12345));
    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleEncrypt} disabled={!isInitialized}>
        Encrypt
      </button>
    </div>
  );
}
```

### useContract

Hook for interacting with smart contracts.

```typescript
const {
  contract,
  call,
  send,
  listen,
  isReady,
  error,
} = useContract({
  address: '0x...',
  abi: [...],
});
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | Contract address |
| `abi` | `any[]` | Contract ABI |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `contract` | `Contract \| null` | Ethers contract instance |
| `call` | `<T>(method: string, ...args) => Promise<T>` | Call view function |
| `send` | `(method: string, ...args) => Promise<Transaction>` | Send transaction |
| `listen` | `(event: string, callback) => () => void` | Listen to events |
| `isReady` | `boolean` | Whether contract is ready |
| `error` | `Error \| null` | Any contract error |

#### Example

```typescript
function ContractDemo() {
  const { call, send, listen } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    // Listen to events
    const unsubscribe = listen('CountUpdated', (newCount) => {
      setCount(Number(newCount));
    });

    return () => unsubscribe();
  }, []);

  const increment = async () => {
    const tx = await send('increment');
    await tx.wait();
  };

  const getCount = async () => {
    const result = await call<bigint>('getCount');
    setCount(Number(result));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={getCount}>Refresh</button>
    </div>
  );
}
```

### useWallet

Hook for wallet connection and management.

```typescript
const {
  address,
  chainId,
  balance,
  isConnected,
  connect,
  disconnect,
  switchChain,
} = useWallet();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `address` | `string \| null` | Connected wallet address |
| `chainId` | `number \| null` | Current chain ID |
| `balance` | `string` | Wallet balance in ETH |
| `isConnected` | `boolean` | Whether wallet is connected |
| `connect` | `() => Promise<void>` | Connect wallet |
| `disconnect` | `() => void` | Disconnect wallet |
| `switchChain` | `(chainId: number) => Promise<void>` | Switch network |

#### Example

```typescript
function WalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>{address?.substring(0, 6)}...{address?.substring(38)}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

## Core Functions

### createFhevmInstance

Create an FHEVM instance for non-React usage.

```typescript
async function createFhevmInstance(
  config: FHEVMConfig
): Promise<FhevmInstance>
```

#### Parameters

```typescript
interface FHEVMConfig {
  chainId: number;
  network?: string;
  gatewayUrl?: string;
  publicKey?: string;
}
```

#### Returns

`Promise<FhevmInstance>` - FHEVM instance

#### Example

```typescript
import { createFhevmInstance } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({
  chainId: 11155111,
  network: 'sepolia',
});

const encrypted = await fhevm.encrypt64(BigInt(12345));
```

### encryptValue

Encrypt a value with automatic type detection.

```typescript
async function encryptValue(
  instance: FhevmInstance,
  value: any,
  type: FHEType
): Promise<Uint8Array>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instance` | `FhevmInstance` | FHEVM instance |
| `value` | `any` | Value to encrypt |
| `type` | `FHEType` | Encryption type |

#### Returns

`Promise<Uint8Array>` - Encrypted data

#### Example

```typescript
import { createFhevmInstance, encryptValue } from '@fhevm/sdk';

const fhevm = await createFhevmInstance({ chainId: 11155111 });
const encrypted = await encryptValue(fhevm, 100, 'uint32');
```

## Types

### FHEType

Supported encryption types.

```typescript
type FHEType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address';
```

### FHEVMConfig

Configuration for FHEVM initialization.

```typescript
interface FHEVMConfig {
  chainId: number;           // Network chain ID
  network?: string;          // Network name
  gatewayUrl?: string;       // Custom gateway URL
  publicKey?: string;        // Pre-loaded public key
  autoInit?: boolean;        // Auto-initialize
}
```

### WalletState

Wallet connection state.

```typescript
interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
}
```

### EncryptedData

Encrypted data structure.

```typescript
interface EncryptedData {
  value: Uint8Array;
  type: FHEType;
  timestamp: number;
}
```

## Provider

### FHEVMProvider

React context provider for FHEVM.

```typescript
<FHEVMProvider config={config}>
  {children}
</FHEVMProvider>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `FHEVMConfig` | Yes | FHEVM configuration |
| `children` | `ReactNode` | Yes | Child components |

#### Example

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

## Error Handling

All async functions may throw errors. Always use try-catch:

```typescript
try {
  const encrypted = await encrypt64(BigInt(12345));
  console.log('Success:', encrypted);
} catch (error) {
  console.error('Encryption failed:', error);
}
```

Common errors:

- `FHEVM not initialized` - Call `init()` first
- `Invalid value` - Value out of range for type
- `Network mismatch` - Wrong network selected
- `Wallet not connected` - Connect wallet first

## Type Ranges

| Type | Range |
|------|-------|
| `uint8` | 0 to 255 |
| `uint16` | 0 to 65,535 |
| `uint32` | 0 to 4,294,967,295 |
| `uint64` | 0 to 18,446,744,073,709,551,615 |
| `uint128` | 0 to 2^128 - 1 |
| `uint256` | 0 to 2^256 - 1 |
| `bool` | true or false |
| `address` | Valid Ethereum address (0x...) |

## Best Practices

1. **Always check initialization** before encrypting
2. **Handle errors gracefully** with try-catch
3. **Validate inputs** before encryption
4. **Cache instances** when possible
5. **Clean up event listeners** in useEffect cleanup
6. **Use TypeScript** for better type safety

## See Also

- [Getting Started](./getting-started.md)
- [Examples](./examples.md)
- [Best Practices](./best-practices.md)
- [Troubleshooting](./troubleshooting.md)
