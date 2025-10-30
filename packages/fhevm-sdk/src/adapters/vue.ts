/**
 * Vue 3 Adapter for FHEVM SDK
 * Provides Vue-specific composables and utilities
 */

import { ref, computed, onMounted, onUnmounted, Ref } from 'vue';
import { FhevmCore, createFhevmCore } from '../core/fhevm';
import { FhevmConfig } from '../types';
import { ethers } from 'ethers';

/**
 * Vue composable for FHEVM
 */
export function useFhevmVue(config: FhevmConfig) {
  const core: Ref<FhevmCore | null> = ref(null);
  const isReady = ref(false);
  const error: Ref<Error | null> = ref(null);

  const init = async () => {
    try {
      core.value = await createFhevmCore(config);
      isReady.value = true;
    } catch (err) {
      error.value = err as Error;
      console.error('FHEVM initialization failed:', err);
    }
  };

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    if (core.value) {
      core.value.destroy();
    }
  });

  const encrypt = async (value: number | string): Promise<Uint8Array> => {
    if (!core.value) {
      throw new Error('FHEVM not initialized');
    }
    return await core.value.encrypt(value);
  };

  return {
    isReady: computed(() => isReady.value),
    error: computed(() => error.value),
    encrypt,
    core: computed(() => core.value),
  };
}

/**
 * Vue composable for wallet connection
 */
export function useWalletVue() {
  const address: Ref<string | null> = ref(null);
  const chainId: Ref<number | null> = ref(null);
  const balance: Ref<string | null> = ref(null);
  const isConnected = ref(false);
  const error: Ref<Error | null> = ref(null);

  let provider: ethers.providers.Web3Provider | null = null;
  let signer: ethers.Signer | null = null;

  const connect = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not detected');
      }

      provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      signer = provider.getSigner();

      address.value = await signer.getAddress();
      const network = await provider.getNetwork();
      chainId.value = network.chainId;

      const bal = await provider.getBalance(address.value);
      balance.value = ethers.utils.formatEther(bal);

      isConnected.value = true;
      error.value = null;
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const disconnect = () => {
    address.value = null;
    chainId.value = null;
    balance.value = null;
    isConnected.value = false;
    provider = null;
    signer = null;
  };

  return {
    address: computed(() => address.value),
    chainId: computed(() => chainId.value),
    balance: computed(() => balance.value),
    isConnected: computed(() => isConnected.value),
    error: computed(() => error.value),
    connect,
    disconnect,
    signer: computed(() => signer),
    provider: computed(() => provider),
  };
}

/**
 * Export all Vue adapters
 */
export default {
  useFhevmVue,
  useWalletVue,
};
