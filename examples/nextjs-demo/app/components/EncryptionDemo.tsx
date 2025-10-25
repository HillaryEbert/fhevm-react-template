'use client';

import { useFHEVM } from '@fhevm/sdk/react';
import { useState } from 'react';

type EncryptionType = '8' | '16' | '32' | '64' | '128' | '256' | 'bool' | 'address';

export default function EncryptionDemo() {
  const { encrypt8, encrypt16, encrypt32, encrypt64, encrypt128, encrypt256, encryptBool, encryptAddress, error } = useFHEVM();

  const [selectedType, setSelectedType] = useState<EncryptionType>('64');
  const [inputValue, setInputValue] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [result, setResult] = useState<{
    original: string;
    encrypted: string;
    type: string;
    timestamp: string;
  } | null>(null);

  const encryptionTypes = [
    { value: '8', label: 'uint8', description: '0 to 255' },
    { value: '16', label: 'uint16', description: '0 to 65,535' },
    { value: '32', label: 'uint32', description: '0 to 4,294,967,295' },
    { value: '64', label: 'uint64', description: '0 to 18,446,744,073,709,551,615' },
    { value: '128', label: 'uint128', description: 'Very large integers' },
    { value: '256', label: 'uint256', description: 'Extremely large integers' },
    { value: 'bool', label: 'ebool', description: 'true or false' },
    { value: 'address', label: 'eaddress', description: 'Ethereum address' },
  ];

  const handleEncrypt = async () => {
    if (!inputValue.trim()) {
      return;
    }

    setIsEncrypting(true);
    setResult(null);

    try {
      let encrypted: Uint8Array | null = null;

      switch (selectedType) {
        case '8':
          encrypted = await encrypt8(Number(inputValue));
          break;
        case '16':
          encrypted = await encrypt16(Number(inputValue));
          break;
        case '32':
          encrypted = await encrypt32(Number(inputValue));
          break;
        case '64':
          encrypted = await encrypt64(BigInt(inputValue));
          break;
        case '128':
          encrypted = await encrypt128(BigInt(inputValue));
          break;
        case '256':
          encrypted = await encrypt256(BigInt(inputValue));
          break;
        case 'bool':
          encrypted = await encryptBool(inputValue.toLowerCase() === 'true');
          break;
        case 'address':
          encrypted = await encryptAddress(inputValue);
          break;
      }

      if (encrypted) {
        const hexString = Array.from(encrypted)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        setResult({
          original: inputValue,
          encrypted: '0x' + hexString,
          type: selectedType,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      console.error('Encryption error:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'bool':
        return 'true or false';
      case 'address':
        return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
      default:
        return 'Enter a number';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">
        🔐 FHE Encryption Demo
      </h2>

      {/* Type Selection */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">
          Select Encryption Type:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {encryptionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value as EncryptionType)}
              className={`p-3 rounded-lg font-semibold transition-all ${
                selectedType === type.value
                  ? 'bg-purple-500 text-white shadow-lg ring-2 ring-purple-400'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="text-sm">{type.label}</div>
              <div className="text-xs opacity-70 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">
          Enter Value to Encrypt:
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Encrypt Button */}
      <button
        onClick={handleEncrypt}
        disabled={isEncrypting || !inputValue.trim()}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isEncrypting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Encrypting...
          </span>
        ) : (
          'Encrypt with FHE'
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200">❌ {error.message}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="text-lg font-bold text-green-300 mb-4">
            ✅ Encryption Successful!
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm">Original Value:</span>
              <p className="text-white font-mono mt-1">{result.original}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Type:</span>
              <p className="text-white font-mono mt-1">
                euint{result.type} / e{result.type}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Encrypted Data:</span>
              <p className="text-white font-mono text-xs mt-1 break-all bg-black/30 p-3 rounded">
                {result.encrypted}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Timestamp:</span>
              <p className="text-white font-mono text-sm mt-1">{result.timestamp}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-blue-200 text-sm">
              💡 This encrypted data can now be sent to a smart contract for FHE computation!
            </p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-white font-semibold mb-2">ℹ️ How it works:</h4>
        <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
          <li>Data is encrypted using Zama's FHE public key</li>
          <li>Encrypted data can be used in smart contracts</li>
          <li>Computations are performed on encrypted data</li>
          <li>Results remain encrypted until decryption is requested</li>
        </ul>
      </div>
    </div>
  );
}
