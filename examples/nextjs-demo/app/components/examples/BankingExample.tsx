/**
 * BankingExample Component
 * Demonstrates FHE usage in a banking/financial context
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@quantum-privacy/fhevm-sdk';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function BankingExample() {
  const { encrypt64, isInitialized } = useFhevm();
  const [balance, setBalance] = useState('1000');
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleTransaction = async () => {
    if (!amount || !isInitialized) return;

    setIsProcessing(true);
    try {
      const encryptedAmount = await encrypt64(BigInt(amount));
      if (!encryptedAmount) {
        throw new Error('Encryption failed');
      }

      // Simulate transaction
      const transaction = {
        type: operation,
        amount: amount,
        encrypted: true,
        timestamp: new Date().toLocaleString(),
        id: Math.random().toString(36).substring(7),
      };

      setTransactions([transaction, ...transactions]);
      setAmount('');
    } catch (error: any) {
      console.error('Transaction error:', error);
    } finally {
      setIsProcessing(false);
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
    <Card title="🏦 Private Banking">
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
          <p className="text-gray-300 text-sm mb-1">Encrypted Balance:</p>
          <p className="text-white text-3xl font-bold">****</p>
          <p className="text-gray-400 text-xs mt-2">
            Only you can decrypt and view your balance
          </p>
        </div>

        {/* Transaction Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOperation('deposit')}
              className={`p-3 rounded-lg font-semibold transition-all ${
                operation === 'deposit'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setOperation('withdraw')}
              className={`p-3 rounded-lg font-semibold transition-all ${
                operation === 'withdraw'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Withdraw
            </button>
          </div>

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            label={`${operation === 'deposit' ? 'Deposit' : 'Withdraw'} Amount`}
          />

          <Button
            variant={operation === 'deposit' ? 'success' : 'danger'}
            onClick={handleTransaction}
            disabled={!amount}
            isLoading={isProcessing}
            className="w-full"
          >
            {operation === 'deposit' ? 'Deposit' : 'Withdraw'} (Encrypted)
          </Button>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-white font-semibold mb-3">Transaction History:</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-white/5 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.type === 'deposit'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {tx.type}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">{tx.timestamp}</p>
                  </div>
                  <p className="text-white font-mono">****</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Privacy Features:</h4>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>All amounts are encrypted end-to-end</li>
            <li>Smart contracts process encrypted values</li>
            <li>Only you can decrypt your balance</li>
            <li>Complete transaction privacy</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
