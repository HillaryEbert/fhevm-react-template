'use client';

import { useFHEVM } from '@fhevm/sdk/react';
import { useEffect, useState } from 'react';

export default function StatusBar() {
  const { client, isInitialized } = useFHEVM();
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<string>('');

  useEffect(() => {
    if (isInitialized && client) {
      const loadInfo = async () => {
        const signer = client.getSigner();
        if (signer) {
          const address = await signer.getAddress();
          setAccount(address);
        }

        const provider = client.getProvider();
        if (provider) {
          const network = await provider.getNetwork();
          setNetwork(network.name);
        }
      };
      loadInfo();
    }
  }, [isInitialized, client]);

  if (!isInitialized) return null;

  return (
    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Connected</span>
            </div>
            {account && (
              <div className="text-gray-300">
                <span className="font-mono text-sm">
                  {account.substring(0, 6)}...{account.substring(38)}
                </span>
              </div>
            )}
          </div>
          {network && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Network:</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-semibold">
                {network}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
