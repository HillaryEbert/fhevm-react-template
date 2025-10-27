# Framework Integration Guide

Learn how to integrate the FHEVM SDK with different JavaScript frameworks.

## Table of Contents

- [React / Next.js](#react--nextjs)
- [Vue 3](#vue-3)
- [Angular](#angular)
- [Svelte](#svelte)
- [Vanilla JavaScript](#vanilla-javascript)
- [Node.js](#nodejs)

## React / Next.js

### Next.js 13+ (App Router)

#### 1. Install Dependencies

```bash
npm install @fhevm/sdk ethers fhevmjs
```

#### 2. Create Provider

```typescript
// app/providers.tsx
'use client';

import { FHEVMProvider } from '@fhevm/sdk/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
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

#### 3. Add Provider to Layout

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 4. Use in Components

```typescript
// app/page.tsx
'use client';

import { useFHEVM } from '@fhevm/sdk/react';

export default function Home() {
  const { isInitialized, encrypt64 } = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await encrypt64(BigInt(12345));
    console.log(encrypted);
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={!isInitialized}>
        Encrypt
      </button>
    </div>
  );
}
```

### React 18 (Create React App / Vite)

#### 1. Setup Provider

```typescript
// src/main.tsx or src/index.tsx
import { FHEVMProvider } from '@fhevm/sdk/react';
import App from './App';

function Root() {
  return (
    <FHEVMProvider
      config={{
        chainId: 11155111,
        network: 'sepolia',
        autoInit: true,
      }}
    >
      <App />
    </FHEVMProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
```

#### 2. Use Hooks

```typescript
// src/components/EncryptDemo.tsx
import { useFHEVM } from '@fhevm/sdk/react';
import { useState } from 'react';

export function EncryptDemo() {
  const { encrypt32, isInitialized } = useFHEVM();
  const [value, setValue] = useState('');

  const handleEncrypt = async () => {
    const encrypted = await encrypt32(Number(value));
    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleEncrypt} disabled={!isInitialized}>
        Encrypt
      </button>
    </div>
  );
}
```

## Vue 3

### 1. Install Dependencies

```bash
npm install @fhevm/sdk ethers fhevmjs
```

### 2. Create Composable

```typescript
// composables/useFHEVM.ts
import { ref, onMounted } from 'vue';
import { createFhevmInstance } from '@fhevm/sdk';

export function useFHEVM() {
  const isInitialized = ref(false);
  const isInitializing = ref(false);
  const error = ref<Error | null>(null);
  const instance = ref<any>(null);

  const init = async () => {
    isInitializing.value = true;
    try {
      instance.value = await createFhevmInstance({
        chainId: 11155111,
        network: 'sepolia',
      });
      isInitialized.value = true;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isInitializing.value = false;
    }
  };

  onMounted(() => {
    init();
  });

  const encrypt8 = async (value: number) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encrypt8(value);
  };

  const encrypt16 = async (value: number) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encrypt16(value);
  };

  const encrypt32 = async (value: number) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encrypt32(value);
  };

  const encrypt64 = async (value: bigint) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encrypt64(value);
  };

  const encryptBool = async (value: boolean) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encryptBool(value);
  };

  const encryptAddress = async (value: string) => {
    if (!instance.value) throw new Error('Not initialized');
    return instance.value.encryptAddress(value);
  };

  return {
    isInitialized,
    isInitializing,
    error,
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    encryptBool,
    encryptAddress,
  };
}
```

### 3. Use in Components

```vue
<!-- components/EncryptDemo.vue -->
<template>
  <div>
    <div v-if="isInitializing">
      <p>Initializing FHEVM...</p>
    </div>

    <div v-else-if="isInitialized">
      <input v-model="value" type="number" placeholder="Enter value" />
      <button @click="handleEncrypt">Encrypt</button>

      <div v-if="encrypted">
        <p>Encrypted successfully!</p>
      </div>
    </div>

    <div v-if="error">
      <p>Error: {{ error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFHEVM } from '@/composables/useFHEVM';

const { isInitialized, isInitializing, error, encrypt64 } = useFHEVM();
const value = ref('');
const encrypted = ref<Uint8Array | null>(null);

const handleEncrypt = async () => {
  try {
    encrypted.value = await encrypt64(BigInt(value.value));
  } catch (err) {
    console.error('Encryption error:', err);
  }
};
</script>
```

## Angular

### 1. Install Dependencies

```bash
npm install @fhevm/sdk ethers fhevmjs
```

### 2. Create Service

```typescript
// services/fhevm.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createFhevmInstance } from '@fhevm/sdk';

@Injectable({
  providedIn: 'root'
})
export class FhevmService {
  private instance: any = null;
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.initializedSubject.asObservable();

  async init() {
    try {
      this.instance = await createFhevmInstance({
        chainId: 11155111,
        network: 'sepolia',
      });
      this.initializedSubject.next(true);
    } catch (error) {
      console.error('FHEVM initialization error:', error);
      throw error;
    }
  }

  async encrypt8(value: number): Promise<Uint8Array> {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance.encrypt8(value);
  }

  async encrypt32(value: number): Promise<Uint8Array> {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance.encrypt32(value);
  }

  async encrypt64(value: bigint): Promise<Uint8Array> {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance.encrypt64(value);
  }

  async encryptBool(value: boolean): Promise<Uint8Array> {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance.encryptBool(value);
  }

  async encryptAddress(value: string): Promise<Uint8Array> {
    if (!this.instance) throw new Error('Not initialized');
    return this.instance.encryptAddress(value);
  }
}
```

### 3. Use in Component

```typescript
// components/encrypt-demo/encrypt-demo.component.ts
import { Component, OnInit } from '@angular/core';
import { FhevmService } from '../../services/fhevm.service';

@Component({
  selector: 'app-encrypt-demo',
  templateUrl: './encrypt-demo.component.html',
})
export class EncryptDemoComponent implements OnInit {
  value: string = '';
  encrypted: Uint8Array | null = null;
  isInitialized = false;

  constructor(private fhevmService: FhevmService) {}

  ngOnInit() {
    this.fhevmService.init();
    this.fhevmService.isInitialized$.subscribe(
      (initialized) => (this.isInitialized = initialized)
    );
  }

  async handleEncrypt() {
    try {
      this.encrypted = await this.fhevmService.encrypt64(
        BigInt(this.value)
      );
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }
}
```

## Svelte

### 1. Install Dependencies

```bash
npm install @fhevm/sdk ethers fhevmjs
```

### 2. Create Store

```typescript
// stores/fhevm.ts
import { writable } from 'svelte/store';
import { createFhevmInstance } from '@fhevm/sdk';

function createFhevmStore() {
  const { subscribe, set, update } = writable({
    instance: null as any,
    isInitialized: false,
    error: null as Error | null,
  });

  return {
    subscribe,
    init: async () => {
      try {
        const instance = await createFhevmInstance({
          chainId: 11155111,
          network: 'sepolia',
        });
        set({ instance, isInitialized: true, error: null });
      } catch (error) {
        set({ instance: null, isInitialized: false, error: error as Error });
      }
    },
    encrypt64: async (value: bigint) => {
      let instance: any;
      subscribe((state) => (instance = state.instance))();
      if (!instance) throw new Error('Not initialized');
      return instance.encrypt64(value);
    },
  };
}

export const fhevmStore = createFhevmStore();
```

### 3. Use in Component

```svelte
<!-- EncryptDemo.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fhevmStore } from '../stores/fhevm';

  let value = '';
  let encrypted: Uint8Array | null = null;

  onMount(() => {
    fhevmStore.init();
  });

  async function handleEncrypt() {
    try {
      encrypted = await fhevmStore.encrypt64(BigInt(value));
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }
</script>

<div>
  {#if $fhevmStore.isInitialized}
    <input type="number" bind:value placeholder="Enter value" />
    <button on:click={handleEncrypt}>Encrypt</button>

    {#if encrypted}
      <p>Encrypted successfully!</p>
    {/if}
  {:else}
    <p>Initializing FHEVM...</p>
  {/if}

  {#if $fhevmStore.error}
    <p>Error: {$fhevmStore.error.message}</p>
  {/if}
</div>
```

## Vanilla JavaScript

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHEVM Demo</title>
</head>
<body>
  <input type="number" id="value" placeholder="Enter value" />
  <button id="encrypt">Encrypt</button>
  <div id="result"></div>

  <script type="module">
    import { createFhevmInstance } from '@fhevm/sdk';

    let fhevm;

    async function init() {
      fhevm = await createFhevmInstance({
        chainId: 11155111,
        network: 'sepolia',
      });
      console.log('FHEVM initialized');
    }

    document.getElementById('encrypt').addEventListener('click', async () => {
      const value = document.getElementById('value').value;
      const encrypted = await fhevm.encrypt64(BigInt(value));
      document.getElementById('result').textContent =
        `Encrypted: ${Array.from(encrypted).join(',')}`;
    });

    init();
  </script>
</body>
</html>
```

## Node.js

### Server-Side Usage

```typescript
// server.ts
import { createFhevmInstance } from '@fhevm/sdk';
import express from 'express';

const app = express();
app.use(express.json());

let fhevm: any;

async function initFhevm() {
  fhevm = await createFhevmInstance({
    chainId: 11155111,
    network: 'sepolia',
  });
  console.log('FHEVM initialized');
}

app.post('/encrypt', async (req, res) => {
  try {
    const { value, type } = req.body;

    let encrypted;
    switch (type) {
      case 'uint64':
        encrypted = await fhevm.encrypt64(BigInt(value));
        break;
      case 'uint32':
        encrypted = await fhevm.encrypt32(Number(value));
        break;
      default:
        throw new Error('Unsupported type');
    }

    res.json({
      success: true,
      encrypted: Array.from(encrypted),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, async () => {
  await initFhevm();
  console.log('Server running on port 3000');
});
```

## Best Practices

### 1. Error Handling

Always wrap async operations in try-catch:

```typescript
try {
  const encrypted = await encrypt64(BigInt(value));
} catch (error) {
  console.error('Encryption failed:', error);
  // Show user-friendly error message
}
```

### 2. Loading States

Show loading indicators during initialization:

```typescript
{isInitializing && <Spinner />}
{isInitialized && <YourComponent />}
```

### 3. Type Safety

Use TypeScript for better type safety:

```typescript
const encrypted: Uint8Array = await encrypt64(BigInt(12345));
```

### 4. Cleanup

Clean up resources in component unmount:

```typescript
useEffect(() => {
  const unsubscribe = listen('Event', handler);
  return () => unsubscribe();
}, []);
```

## Next Steps

- [API Reference](./api-reference.md)
- [Examples](./examples.md)
- [Best Practices](./best-practices.md)
