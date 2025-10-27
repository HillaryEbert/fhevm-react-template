# Code Examples

Practical examples for common FHEVM SDK use cases.

## Table of Contents

- [Basic Encryption](#basic-encryption)
- [Contract Interaction](#contract-interaction)
- [Event Handling](#event-handling)
- [Advanced Patterns](#advanced-patterns)

## Basic Encryption

### Encrypt Different Types

```typescript
import { useFHEVM } from '@fhevm/sdk/react';

function EncryptionExamples() {
  const {
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    encrypt128,
    encrypt256,
    encryptBool,
    encryptAddress,
  } = useFHEVM();

  const examples = async () => {
    // Encrypt uint8 (0-255)
    const enc8 = await encrypt8(42);

    // Encrypt uint16 (0-65535)
    const enc16 = await encrypt16(1000);

    // Encrypt uint32
    const enc32 = await encrypt32(100000);

    // Encrypt uint64 (requires BigInt)
    const enc64 = await encrypt64(BigInt(1000000000));

    // Encrypt uint128 (large numbers)
    const enc128 = await encrypt128(BigInt('123456789012345678901234567890'));

    // Encrypt uint256 (very large numbers)
    const enc256 = await encrypt256(BigInt('0xFFFFFFFF'));

    // Encrypt boolean
    const encBool = await encryptBool(true);

    // Encrypt Ethereum address
    const encAddr = await encryptAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  };

  return <button onClick={examples}>Run Examples</button>;
}
```

### With Error Handling

```typescript
async function safeEncrypt(value: string) {
  try {
    const encrypted = await encrypt64(BigInt(value));
    console.log('Success:', encrypted);
    return { success: true, data: encrypted };
  } catch (error) {
    console.error('Encryption failed:', error);
    return { success: false, error: error.message };
  }
}
```

### With Validation

```typescript
function validateAndEncrypt(value: string, type: 'uint8' | 'uint16' | 'uint32') {
  const ranges = {
    uint8: { min: 0, max: 255 },
    uint16: { min: 0, max: 65535 },
    uint32: { min: 0, max: 4294967295 },
  };

  const num = Number(value);
  const range = ranges[type];

  if (num < range.min || num > range.max) {
    throw new Error(`Value must be between ${range.min} and ${range.max}`);
  }

  if (!Number.isInteger(num)) {
    throw new Error('Value must be an integer');
  }

  return encrypt32(num);
}
```

## Contract Interaction

### Store Encrypted Data

```typescript
import { useFHEVM, useContract } from '@fhevm/sdk/react';
import { useState } from 'react';

const CONTRACT_ABI = [
  'function storeValue(bytes calldata encryptedValue) external',
  'function getValue(uint256 id) external view returns (bytes memory)',
];

function StoreData() {
  const { encrypt64 } = useFHEVM();
  const { send, call } = useContract({
    address: '0x...',
    abi: CONTRACT_ABI,
  });

  const [value, setValue] = useState('');

  const handleStore = async () => {
    // 1. Encrypt the value
    const encrypted = await encrypt64(BigInt(value));

    // 2. Send to contract
    const tx = await send('storeValue', encrypted);

    // 3. Wait for confirmation
    const receipt = await tx.wait();

    console.log('Stored in transaction:', receipt.transactionHash);
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleStore}>Store</button>
    </div>
  );
}
```

### Query Contract Data

```typescript
function QueryData() {
  const { call } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [result, setResult] = useState<any>(null);

  const handleQuery = async () => {
    const data = await call('getValue', 1);
    setResult(data);
  };

  return (
    <div>
      <button onClick={handleQuery}>Query</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### Multiple Contract Calls

```typescript
async function batchCalls() {
  const { call } = useContract({ address, abi });

  // Execute multiple calls in parallel
  const [count, owner, data] = await Promise.all([
    call<bigint>('getCount'),
    call<string>('getOwner'),
    call<any>('getData', 1),
  ]);

  return { count: Number(count), owner, data };
}
```

## Event Handling

### Listen to Events

```typescript
import { useEffect } from 'react';
import { useContract } from '@fhevm/sdk/react';

function EventListener() {
  const { listen } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  useEffect(() => {
    // Listen to DataStored event
    const unsubscribe = listen(
      'DataStored',
      (dataId, owner, timestamp, event) => {
        console.log('Data stored:', {
          dataId: dataId.toString(),
          owner,
          timestamp: new Date(Number(timestamp) * 1000),
          txHash: event.transactionHash,
        });
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, [listen]);

  return <div>Listening for events...</div>;
}
```

### Multiple Event Listeners

```typescript
useEffect(() => {
  const unsubscribe1 = listen('DataStored', handleDataStored);
  const unsubscribe2 = listen('DataUpdated', handleDataUpdated);
  const unsubscribe3 = listen('DataDeleted', handleDataDeleted);

  return () => {
    unsubscribe1();
    unsubscribe2();
    unsubscribe3();
  };
}, []);
```

### Event with State Update

```typescript
function EventTracker() {
  const [events, setEvents] = useState<any[]>([]);
  const { listen } = useContract({ address, abi });

  useEffect(() => {
    const unsubscribe = listen('DataStored', (...args) => {
      const newEvent = {
        id: args[0].toString(),
        owner: args[1],
        timestamp: Date.now(),
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 10)); // Keep last 10
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h3>Recent Events</h3>
      {events.map((event, i) => (
        <div key={i}>{JSON.stringify(event)}</div>
      ))}
    </div>
  );
}
```

## Advanced Patterns

### Custom Hook for Encryption

```typescript
import { useFHEVM } from '@fhevm/sdk/react';
import { useState, useCallback } from 'react';

function useEncryption() {
  const { encrypt64, isInitialized } = useFHEVM();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: bigint) => {
      if (!isInitialized) {
        throw new Error('FHEVM not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await encrypt64(value);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [encrypt64, isInitialized]
  );

  return { encrypt, isEncrypting, error, isReady: isInitialized };
}

// Usage
function MyComponent() {
  const { encrypt, isEncrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(BigInt(12345));
    console.log(encrypted);
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Batch Encryption

```typescript
async function encryptBatch(values: bigint[]) {
  const { encrypt64 } = useFHEVM();

  const promises = values.map((value) => encrypt64(value));
  const results = await Promise.all(promises);

  return results;
}

// Usage
const encrypted = await encryptBatch([100n, 200n, 300n]);
```

### Form with Multiple Encrypted Fields

```typescript
function EncryptedForm() {
  const { encrypt32, encryptBool, encryptAddress } = useFHEVM();
  const [form, setForm] = useState({
    age: '',
    isActive: false,
    wallet: '',
  });

  const handleSubmit = async () => {
    const encrypted = {
      age: await encrypt32(Number(form.age)),
      isActive: await encryptBool(form.isActive),
      wallet: await encryptAddress(form.wallet),
    };

    // Send encrypted data to contract
    await send('submitForm', encrypted.age, encrypted.isActive, encrypted.wallet);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />
      <input
        type="checkbox"
        checked={form.isActive}
        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
      />
      <input
        type="text"
        value={form.wallet}
        onChange={(e) => setForm({ ...form, wallet: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Polling for Updates

```typescript
function PollingExample() {
  const { call } = useContract({ address, abi });
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      while (mounted) {
        const result = await call('getData');
        setData(result);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
      }
    }

    poll();

    return () => {
      mounted = false;
    };
  }, []);

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

### Optimistic Updates

```typescript
function OptimisticUpdate() {
  const [count, setCount] = useState(0);
  const { send } = useContract({ address, abi });

  const increment = async () => {
    // Optimistically update UI
    setCount((prev) => prev + 1);

    try {
      const tx = await send('increment');
      await tx.wait();
      // Success - UI already updated
    } catch (error) {
      // Rollback on error
      setCount((prev) => prev - 1);
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### Infinite Scroll with Contract Data

```typescript
function InfiniteList() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { call } = useContract({ address, abi });

  const loadMore = async () => {
    const newItems = await call('getItems', page, 10);

    if (newItems.length < 10) {
      setHasMore(false);
    }

    setItems([...items, ...newItems]);
    setPage(page + 1);
  };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>{item.toString()}</div>
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

## See Also

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Best Practices](./best-practices.md)
- [Framework Integration](./framework-integration.md)
