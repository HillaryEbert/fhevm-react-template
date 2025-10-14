/**
 * FHEVM Context Provider
 * Provides FHEVM instance and wallet state to React components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  FhevmConfig,
  FhevmInstance,
  WalletState,
  FhevmContextValue,
  FhevmProviderProps,
  EncryptedData,
  DecryptionRequest,
} from '../types';
import { createFhevmInstance, encryptValue } from '../utils/encryption';

// Create context
const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

/**
 * FHEVM Provider Component
 */
export const FhevmProvider: React.FC<FhevmProviderProps> = ({ config, children }) => {
  const [fhevmInstance, setFhevmInstance] = useState<FhevmInstance | null>(null);
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    balance: null,
    provider: null,
    signer: null,
  });
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  /**
   * Initialize FHEVM instance
   */
  useEffect(() => {
    const initFhevm = async () => {
      try {
        console.log('Initializing FHEVM instance...');
        const instance = await createFhevmInstance(config);
        setFhevmInstance({
          instance,
          isReady: true,
          chainId: config.chainId,
        });
        setIsReady(true);
        console.log('FHEVM instance initialized successfully');
      } catch (err) {
        console.error('FHEVM initialization failed:', err);
        setError(err as Error);
      }
    };

    initFhevm();
  }, [config]);

  /**
   * Connect wallet
   */
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    try {
      // Request accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setWallet({
        address,
        chainId: network.chainId,
        isConnected: true,
        balance: ethers.utils.formatEther(balance),
        provider,
        signer,
      });

      console.log('Wallet connected:', address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      throw err;
    }
  }, []);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      balance: null,
      provider: null,
      signer: null,
    });
    console.log('Wallet disconnected');
  }, []);

  /**
   * Encrypt value
   */
  const encrypt = useCallback(
    async (value: number | string): Promise<EncryptedData> => {
      if (!fhevmInstance || !fhevmInstance.instance) {
        throw new Error('FHEVM instance not ready');
      }

      try {
        const encrypted = await encryptValue(fhevmInstance.instance, value);
        return {
          data: encrypted,
          signature: '', // Add signature if needed
        };
      } catch (err) {
        console.error('Encryption failed:', err);
        throw err;
      }
    },
    [fhevmInstance]
  );

  /**
   * Decrypt value
   */
  const decrypt = useCallback(
    async (request: DecryptionRequest): Promise<any> => {
      if (!fhevmInstance || !fhevmInstance.instance) {
        throw new Error('FHEVM instance not ready');
      }

      if (!wallet.signer) {
        throw new Error('Wallet not connected');
      }

      // Implement decryption logic here
      // This will depend on your specific contract implementation
      console.log('Decryption requested for:', request);

      // Placeholder - implement actual decryption
      return null;
    },
    [fhevmInstance, wallet]
  );

  /**
   * Listen for account changes
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (wallet.isConnected) {
        // Reconnect with new account
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [wallet.isConnected, connectWallet, disconnectWallet]);

  const contextValue: FhevmContextValue = {
    fhevmInstance,
    wallet,
    connectWallet,
    disconnectWallet,
    encrypt,
    decrypt,
    isReady,
    error,
  };

  return <FhevmContext.Provider value={contextValue}>{children}</FhevmContext.Provider>;
};

/**
 * Hook to use FHEVM context
 */
export const useFhevmContext = (): FhevmContextValue => {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
};

// Export context for advanced usage
export { FhevmContext };
