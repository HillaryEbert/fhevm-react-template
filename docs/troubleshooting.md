# Troubleshooting Guide

Common issues and solutions when using the FHEVM SDK.

## Installation Issues

### Module Not Found

**Problem:**
```
Error: Cannot find module '@fhevm/sdk'
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Peer Dependency Warnings

**Problem:**
```
npm WARN @fhevm/sdk@1.0.0 requires a peer of ethers@^6.0.0
```

**Solution:**
```bash
# Install missing peer dependencies
npm install ethers@^6.0.0 fhevmjs@^0.5.0
```

### TypeScript Errors

**Problem:**
```
Could not find a declaration file for module '@fhevm/sdk'
```

**Solution:**

Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Initialization Issues

### FHEVM Won't Initialize

**Problem:**
- `isInitialized` stays `false`
- No error message

**Possible Causes & Solutions:**

1. **Wallet not connected**
   ```typescript
   // Check wallet connection first
   const { isConnected, connect } = useWallet();

   if (!isConnected) {
     await connect();
   }
   ```

2. **Wrong network**
   ```typescript
   // Ensure you're on Sepolia
   const { switchChain } = useWallet();

   await switchChain(11155111); // Sepolia chain ID
   ```

3. **Public key fetch failed**
   ```typescript
   // Check console for network errors
   // Verify gateway URL is accessible
   const config = {
     chainId: 11155111,
     gatewayUrl: 'https://gateway.fhevm.io', // Check this URL
   };
   ```

### Initialization Takes Too Long

**Problem:**
- Initialization hangs or takes minutes

**Solutions:**

1. **Check network connection**
   ```typescript
   // Test gateway connectivity
   fetch('https://gateway.fhevm.io/health')
     .then(res => console.log('Gateway accessible'))
     .catch(err => console.error('Gateway unreachable:', err));
   ```

2. **Use cached public key**
   ```typescript
   const cachedKey = localStorage.getItem('fhevm_public_key');

   const config = {
     chainId: 11155111,
     publicKey: cachedKey || undefined,
   };
   ```

3. **Increase timeout**
   ```typescript
   // Implement manual timeout
   const initWithTimeout = async (timeoutMs = 30000) => {
     const timeoutPromise = new Promise((_, reject) =>
       setTimeout(() => reject(new Error('Timeout')), timeoutMs)
     );

     return Promise.race([init(), timeoutPromise]);
   };
   ```

## Encryption Issues

### Encryption Returns Null

**Problem:**
```typescript
const encrypted = await encrypt64(BigInt(12345));
// encrypted is null
```

**Solutions:**

1. **Check initialization**
   ```typescript
   const { isInitialized, encrypt64 } = useFHEVM();

   if (!isInitialized) {
     console.error('FHEVM not initialized');
     return;
   }

   const encrypted = await encrypt64(BigInt(12345));
   ```

2. **Verify value type**
   ```typescript
   // For uint64, use BigInt
   const encrypted = await encrypt64(BigInt(value)); // ✓

   // Not this:
   const encrypted = await encrypt64(Number(value)); // ✗
   ```

### Value Out of Range Error

**Problem:**
```
Error: Value out of range for uint8
```

**Solution:**

Validate before encrypting:
```typescript
function validateAndEncrypt(value: string, type: FHEType) {
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

  return encrypt32(num);
}
```

### BigInt Type Errors

**Problem:**
```typescript
// TypeScript error: Argument of type 'number' is not assignable to parameter of type 'bigint'
const encrypted = await encrypt64(12345);
```

**Solution:**
```typescript
// Use BigInt() constructor
const encrypted = await encrypt64(BigInt(12345)); // ✓

// Or bigint literal
const encrypted = await encrypt64(12345n); // ✓
```

## Contract Interaction Issues

### Contract Calls Fail

**Problem:**
```
Error: call revert exception
```

**Solutions:**

1. **Verify contract address**
   ```typescript
   // Check address is correct and checksummed
   import { ethers } from 'ethers';

   const address = ethers.getAddress(CONTRACT_ADDRESS);
   ```

2. **Check ABI matches contract**
   ```typescript
   // Ensure ABI is from the correct contract version
   // Verify function names and signatures
   ```

3. **Verify network**
   ```typescript
   const { chainId } = useWallet();

   if (chainId !== 11155111) {
     console.error('Wrong network');
   }
   ```

### Transaction Fails

**Problem:**
```
Error: insufficient funds for gas
```

**Solutions:**

1. **Check ETH balance**
   ```typescript
   const { balance } = useWallet();

   if (parseFloat(balance) < 0.01) {
     alert('Insufficient ETH for gas fees');
   }
   ```

2. **Estimate gas first**
   ```typescript
   const { contract } = useContract({ address, abi });

   const gasEstimate = await contract.estimateGas.functionName(...args);
   console.log('Estimated gas:', gasEstimate.toString());
   ```

3. **Increase gas limit**
   ```typescript
   const tx = await send('functionName', arg1, arg2, {
     gasLimit: 500000, // Increase if needed
   });
   ```

### Events Not Firing

**Problem:**
- Event listeners don't receive events

**Solutions:**

1. **Check event name**
   ```typescript
   // Event names are case-sensitive
   listen('DataStored', handler); // ✓
   listen('dataStored', handler); // ✗ (wrong case)
   ```

2. **Verify filter setup**
   ```typescript
   // Listen from current block
   const filter = contract.filters.DataStored();
   const events = await contract.queryFilter(filter, 'latest');
   ```

3. **Clean up listeners**
   ```typescript
   useEffect(() => {
     const unsubscribe = listen('Event', handler);

     return () => {
       unsubscribe(); // Important!
     };
   }, []);
   ```

## React/Next.js Issues

### Hydration Mismatch

**Problem:**
```
Error: Text content does not match server-rendered HTML
```

**Solution:**

Use client-side rendering:
```typescript
'use client'; // Add this at top of file

import { useState, useEffect } from 'react';

function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or skeleton
  }

  return <YourContent />;
}
```

### Provider Context Not Available

**Problem:**
```
Error: useFHEVM must be used within FHEVMProvider
```

**Solution:**

Wrap app with provider:
```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Window is Not Defined

**Problem:**
```
ReferenceError: window is not defined
```

**Solution:**

Check for browser environment:
```typescript
const isWalletAvailable =
  typeof window !== 'undefined' &&
  typeof window.ethereum !== 'undefined';

if (!isWalletAvailable) {
  return <div>Please install MetaMask</div>;
}
```

## Browser Issues

### MetaMask Not Detected

**Problem:**
- `window.ethereum` is undefined

**Solutions:**

1. **Install MetaMask**
   - Guide users to install: https://metamask.io

2. **Check for injected provider**
   ```typescript
   useEffect(() => {
     if (typeof window.ethereum === 'undefined') {
       console.log('Please install MetaMask');
     }
   }, []);
   ```

3. **Handle mobile browsers**
   ```typescript
   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

   if (isMobile && !window.ethereum) {
     // Redirect to MetaMask mobile app
     window.location.href = `https://metamask.app.link/dapp/${window.location.host}`;
   }
   ```

### CORS Errors

**Problem:**
```
Access to fetch at 'https://gateway.fhevm.io' has been blocked by CORS policy
```

**Solution:**

Configure Next.js:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  },
};
```

## Performance Issues

### Slow Encryption

**Problem:**
- Encryption takes several seconds

**Solutions:**

1. **Use Web Workers**
   ```typescript
   // Not yet supported, but on roadmap
   ```

2. **Show loading states**
   ```typescript
   const [isEncrypting, setIsEncrypting] = useState(false);

   const handleEncrypt = async () => {
     setIsEncrypting(true);
     try {
       await encrypt64(value);
     } finally {
       setIsEncrypting(false);
     }
   };
   ```

3. **Batch operations**
   ```typescript
   // Encrypt multiple values in parallel
   const results = await Promise.all([
     encrypt64(value1),
     encrypt64(value2),
     encrypt64(value3),
   ]);
   ```

### Memory Leaks

**Problem:**
- Application becomes slow over time

**Solutions:**

1. **Clean up event listeners**
   ```typescript
   useEffect(() => {
     const unsubscribe = listen('Event', handler);
     return () => unsubscribe();
   }, []);
   ```

2. **Avoid state updates on unmounted components**
   ```typescript
   useEffect(() => {
     let mounted = true;

     async function load() {
       const result = await encrypt64(value);
       if (mounted) {
         setEncrypted(result);
       }
     }

     load();
     return () => { mounted = false; };
   }, []);
   ```

## Getting Help

If your issue isn't covered here:

1. **Check Examples**
   - Review working examples in the repository

2. **Search GitHub Issues**
   - Someone may have encountered the same problem

3. **Enable Debug Logging**
   ```typescript
   // Add to your code
   console.log('FHEVM State:', {
     isInitialized,
     error,
     chainId,
   });
   ```

4. **Create a Minimal Reproduction**
   - Isolate the problem
   - Create a minimal test case
   - Share code when reporting issues

5. **Report Issues**
   - GitHub: https://github.com/HillaryEbert/fhevm-react-template/issues
   - Include: error messages, code snippets, environment details

## Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `FHEVM not initialized` | Called encryption before init | Wait for `isInitialized === true` |
| `Network mismatch` | Wrong network selected | Switch to Sepolia |
| `Insufficient funds` | Low ETH balance | Get test ETH from faucet |
| `Value out of range` | Input exceeds type limit | Validate input range |
| `Contract reverted` | Contract logic failed | Check contract state/permissions |
| `User rejected` | User declined transaction | Handle rejection gracefully |

## See Also

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Best Practices](./best-practices.md)
- [Examples](./examples.md)
