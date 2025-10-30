/**
 * KeyManager Component
 * Manages and displays FHE public key information
 */

'use client';

import { useState, useEffect } from 'react';
import { useFhevm } from '@quantum-privacy/fhevm-sdk';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function KeyManager() {
  const { isInitialized, client } = useFhevm();
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      loadKeyInfo();
    }
  }, [isInitialized]);

  const loadKeyInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();
      if (data.success) {
        setKeyInfo(data.publicKey);
      }
    } catch (error) {
      console.error('Failed to load key info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });
      const data = await response.json();
      if (data.success) {
        await loadKeyInfo();
      }
    } catch (error) {
      console.error('Failed to refresh key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <p className="text-gray-300 text-center">Please initialize FHEVM first</p>
      </Card>
    );
  }

  return (
    <Card title="🔑 Key Management">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading key information...</p>
          </div>
        ) : keyInfo ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Network:</p>
              <p className="text-white font-mono">{keyInfo.network}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Chain ID:</p>
              <p className="text-white font-mono">{keyInfo.chainId}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Public Key:</p>
              <p className="text-white font-mono text-xs break-all">
                {keyInfo.key}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Last Updated:</p>
              <p className="text-white font-mono text-sm">
                {new Date(keyInfo.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-center">No key information available</p>
        )}

        <Button
          variant="secondary"
          onClick={handleRefresh}
          isLoading={isLoading}
          className="w-full"
        >
          Refresh Key
        </Button>

        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2">About Public Keys:</h4>
          <p className="text-gray-300 text-sm">
            The FHE public key is used to encrypt data before sending it to smart contracts.
            All encrypted operations use this shared public key from the network.
          </p>
        </div>
      </div>
    </Card>
  );
}
