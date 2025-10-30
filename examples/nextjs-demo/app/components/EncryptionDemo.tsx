'use client';

import { useEncrypt } from '@quantum-privacy/fhevm-sdk';
import { useState } from 'react';

type EncryptionType = '8' | '16' | '32' | '64' | '128' | '256' | 'bool' | 'address';

export default function EncryptionDemo() {
  const { encrypt, isEncrypting: hookEncrypting, error: hookError } = useEncrypt();

  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<{
    original: string;
    encrypted: string;
    timestamp: string;
  } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    if (!inputValue.trim()) {
      return;
    }

    setResult(null);
    setLocalError(null);

    try {
      const numValue = Number(inputValue);
      if (isNaN(numValue) || numValue < 0 || numValue > 255) {
        setLocalError('Please enter a number between 0 and 255');
        return;
      }

      const encrypted = await encrypt(numValue);

      if (encrypted && encrypted.data) {
        const hexString = Array.from(encrypted.data)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        setResult({
          original: inputValue,
          encrypted: '0x' + hexString,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      console.error('Encryption error:', err);
      setLocalError((err as Error).message);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">
        🔐 FHE Encryption Demo
      </h2>

      <p className="text-gray-300 mb-6">
        Encrypt values using Fully Homomorphic Encryption (FHE). Currently supports uint8 (0-255).
      </p>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">
          Enter Value to Encrypt (0-255):
        </label>
        <input
          type="number"
          min="0"
          max="255"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number between 0 and 255"
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Encrypt Button */}
      <button
        onClick={handleEncrypt}
        disabled={hookEncrypting || !inputValue.trim()}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {hookEncrypting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Encrypting...
          </span>
        ) : (
          'Encrypt with FHE'
        )}
      </button>

      {/* Error */}
      {(hookError || localError) && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200">❌ {hookError?.message || localError}</p>
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
                euint8
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
