# Vue FHEVM Template

Modern Vue 3 template with FHEVM SDK integration.

## Features

- ✅ Vue 3 with Composition API
- ✅ TypeScript
- ✅ Vite
- ✅ Tailwind CSS
- ✅ FHEVM SDK integration
- ✅ Vue Router
- ✅ Pinia state management

## Quick Start

```bash
# Copy this template
cp -r templates/vue my-app
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

## Project Structure

```
vue/
├── src/
│   ├── main.ts                 # Entry point
│   ├── App.vue                 # Root component
│   ├── components/
│   │   ├── EncryptForm.vue     # Encryption form
│   │   └── WalletConnect.vue   # Wallet button
│   ├── composables/
│   │   └── useFHEVM.ts         # FHEVM composable
│   ├── stores/
│   │   └── fhevm.ts            # Pinia store
│   ├── router/
│   │   └── index.ts            # Router config
│   └── assets/
│       └── main.css            # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Configuration

### 1. Update Settings

Edit `src/config/constants.ts`:

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

## Composables

### useFHEVM

Main FHEVM composable:

```typescript
import { useFHEVM } from '@/composables/useFHEVM';

export default {
  setup() {
    const { isInitialized, encrypt64 } = useFHEVM();

    return { isInitialized, encrypt64 };
  },
};
```

## Components

### EncryptForm.vue

Encryption form with reactive state:

```vue
<template>
  <div>
    <input v-model="value" type="number" />
    <button @click="handleEncrypt">Encrypt</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFHEVM } from '@/composables/useFHEVM';

const { encrypt64 } = useFHEVM();
const value = ref('');

const handleEncrypt = async () => {
  await encrypt64(BigInt(value.value));
};
</script>
```

### WalletConnect.vue

Wallet connection component.

## State Management

Using Pinia for global state:

```typescript
// stores/fhevm.ts
import { defineStore } from 'pinia';

export const useFhevmStore = defineStore('fhevm', {
  state: () => ({
    isInitialized: false,
    error: null,
  }),
  actions: {
    async init() {
      // Initialize FHEVM
    },
  },
});
```

## Routing

Configure routes:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/encrypt', component: () => import('@/views/Encrypt.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

## Build & Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

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

- [Vue 3 Documentation](https://vuejs.org)
- [Vite Documentation](https://vitejs.dev)
- [Pinia Documentation](https://pinia.vuejs.org)
- [FHEVM SDK Documentation](../../docs)
- [Complete Example](../../examples/vue-demo)

## License

MIT
