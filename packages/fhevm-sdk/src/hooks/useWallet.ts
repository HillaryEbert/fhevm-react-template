/**
 * useWallet Hook
 * Hook for wallet connection and management
 */

import { useFhevmContext } from '../providers/FhevmProvider';

/**
 * Hook to manage wallet connection
 *
 * @example
 * ```tsx
 * const { connect, disconnect, address, isConnected } = useWallet();
 *
 * return (
 *   <button onClick={connect}>
 *     {isConnected ? `Connected: ${address}` : 'Connect Wallet'}
 *   </button>
 * );
 * ```
 */
export const useWallet = () => {
  const { wallet, connectWallet, disconnectWallet } = useFhevmContext();

  return {
    connect: connectWallet,
    disconnect: disconnectWallet,
    address: wallet.address,
    chainId: wallet.chainId,
    balance: wallet.balance,
    isConnected: wallet.isConnected,
    provider: wallet.provider,
    signer: wallet.signer,
  };
};
