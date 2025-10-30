/**
 * ComputationDemo Component
 * Demonstrates homomorphic computation on encrypted data
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@quantum-privacy/fhevm-sdk';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ComputationDemo() {
  const { encrypt64, isInitialized } = useFhevm();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCompute = async () => {
    if (!value1 || !value2) return;

    setIsComputing(true);
    setResult(null);

    try {
      // Encrypt both values
      const encrypted1 = await encrypt64(BigInt(value1));
      const encrypted2 = await encrypt64(BigInt(value2));

      if (!encrypted1 || !encrypted2) {
        throw new Error('Encryption failed');
      }

      // In a real implementation, you would send these to a smart contract
      // that performs homomorphic operations
      const mockResult = `Result of ${value1} ${operation} ${value2} (encrypted)`;
      setResult(mockResult);
    } catch (error: any) {
      console.error('Computation error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setIsComputing(false);
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
    <Card title="⚡ Homomorphic Computation">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Enter first value"
            label="Value 1"
          />
          <Input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Enter second value"
            label="Value 2"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-3">
            Operation:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['add', 'subtract', 'multiply'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  operation === op
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {op === 'add' && '+ Add'}
                {op === 'subtract' && '- Subtract'}
                {op === 'multiply' && '× Multiply'}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleCompute}
          disabled={!value1 || !value2}
          isLoading={isComputing}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        {result && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-200 font-mono text-sm">{result}</p>
          </div>
        )}

        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2">How it works:</h4>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Both values are encrypted with FHE</li>
            <li>Operations are performed on encrypted data</li>
            <li>Result remains encrypted</li>
            <li>Only authorized parties can decrypt the result</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
