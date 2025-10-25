'use client';

import { useFHEVM, useContract } from '@fhevm/sdk/react';
import { useState, useEffect } from 'react';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

const CONTRACT_ABI = [
  'function storeEncryptedData(bytes calldata encryptedValue) external returns (uint256)',
  'function requestDecryption(uint256 dataId) external returns (uint256)',
  'function getDataInfo(uint256 dataId) external view returns (address owner, uint256 timestamp, bool exists)',
  'function getDataCount() external view returns (uint256)',
  'function computeEncryptedSum(uint256 dataId1, uint256 dataId2) external returns (uint256)',
  'event DataStored(uint256 indexed dataId, address indexed owner, uint256 timestamp)',
  'event DecryptionRequested(uint256 indexed requestId, uint256 indexed dataId, address indexed requester)',
  'event DataDecrypted(uint256 indexed dataId, uint64 decryptedValue, address indexed requester)',
];

export default function ContractInteraction() {
  const { encrypt64, isInitialized } = useFHEVM();
  const { contract, call, send, listen, isReady } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [value, setValue] = useState('');
  const [isStoring, setIsStoring] = useState(false);
  const [dataId, setDataId] = useState('');
  const [dataCount, setDataCount] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  // Load data count
  useEffect(() => {
    if (isReady && contract) {
      loadDataCount();

      // Listen to events
      const unsubscribe1 = listen('DataStored', (dataId, owner, timestamp, event) => {
        addEvent({
          type: 'DataStored',
          dataId: dataId.toString(),
          owner,
          timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
          txHash: event.transactionHash,
        });
        loadDataCount();
      });

      const unsubscribe2 = listen('DecryptionRequested', (requestId, dataId, requester, event) => {
        addEvent({
          type: 'DecryptionRequested',
          requestId: requestId.toString(),
          dataId: dataId.toString(),
          requester,
          txHash: event.transactionHash,
        });
      });

      const unsubscribe3 = listen('DataDecrypted', (dataId, decryptedValue, requester, event) => {
        addEvent({
          type: 'DataDecrypted',
          dataId: dataId.toString(),
          decryptedValue: decryptedValue.toString(),
          requester,
          txHash: event.transactionHash,
        });
      });

      return () => {
        unsubscribe1();
        unsubscribe2();
        unsubscribe3();
      };
    }
  }, [isReady, contract]);

  const loadDataCount = async () => {
    const count = await call<bigint>('getDataCount');
    if (count !== null) {
      setDataCount(Number(count));
    }
  };

  const addEvent = (event: any) => {
    setEvents((prev) => [event, ...prev].slice(0, 10));
  };

  const handleStore = async () => {
    if (!value) return;

    setIsStoring(true);
    try {
      // 1. Encrypt the value
      const encrypted = await encrypt64(BigInt(value));
      if (!encrypted) {
        throw new Error('Encryption failed');
      }

      // 2. Send to contract
      const tx = await send('storeEncryptedData', encrypted);
      if (tx) {
        await tx.wait();
        alert('Data stored successfully!');
        setValue('');
      }
    } catch (error: any) {
      console.error('Store error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsStoring(false);
    }
  };

  const handleRequestDecryption = async () => {
    if (!dataId) return;

    try {
      const tx = await send('requestDecryption', dataId);
      if (tx) {
        await tx.wait();
        alert('Decryption requested! Wait for KMS response...');
      }
    } catch (error: any) {
      console.error('Decryption error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleQueryInfo = async () => {
    if (!dataId) return;

    try {
      const info = await call('getDataInfo', dataId);
      if (info) {
        alert(
          `Data Info:\n` +
          `Owner: ${info.owner}\n` +
          `Timestamp: ${new Date(Number(info.timestamp) * 1000).toLocaleString()}\n` +
          `Exists: ${info.exists}`
        );
      }
    } catch (error: any) {
      console.error('Query error:', error);
      alert('Error: ' + error.message);
    }
  };

  if (!isInitialized) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <p className="text-gray-300">Please initialize FHEVM first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Data */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          📤 Store Encrypted Data
        </h2>

        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">
            Enter Value (will be encrypted):
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 12345"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleStore}
          disabled={isStoring || !value || !isReady}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStoring ? 'Storing...' : 'Store Encrypted Data'}
        </button>

        {dataCount !== null && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-blue-200 text-sm">
              📊 Total stored data: <span className="font-bold">{dataCount}</span>
            </p>
          </div>
        )}
      </div>

      {/* Decrypt Data */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          🔓 Request Decryption
        </h2>

        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">
            Data ID:
          </label>
          <input
            type="number"
            value={dataId}
            onChange={(e) => setDataId(e.target.value)}
            placeholder="e.g., 1"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleRequestDecryption}
            disabled={!dataId || !isReady}
            className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Decryption
          </button>

          <button
            onClick={handleQueryInfo}
            disabled={!dataId || !isReady}
            className="py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Query Info
          </button>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">
          📡 Event Log
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No events yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    event.type === 'DataStored' ? 'bg-blue-500/20 text-blue-300' :
                    event.type === 'DecryptionRequested' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-gray-400 text-xs font-mono">
                    {event.txHash?.substring(0, 10)}...
                  </span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  {Object.entries(event).map(([key, value]) => {
                    if (key === 'type' || key === 'txHash') return null;
                    return (
                      <div key={key}>
                        <span className="text-gray-400">{key}:</span>{' '}
                        <span className="font-mono">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contract Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">📄 Contract Info:</h4>
        <p className="text-gray-300 text-sm font-mono break-all">
          Address: {CONTRACT_ADDRESS}
        </p>
        <p className="text-gray-400 text-xs mt-2">
          ⚠️ Replace with your deployed contract address
        </p>
      </div>
    </div>
  );
}
