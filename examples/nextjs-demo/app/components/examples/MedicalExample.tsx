/**
 * MedicalExample Component
 * Demonstrates FHE usage in healthcare/medical records
 */

'use client';

import { useState } from 'react';
import { useFHEVM } from '@fhevm/sdk/react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  encrypted: boolean;
  timestamp: string;
}

export default function MedicalExample() {
  const { encrypt32, encryptBool, isInitialized } = useFHEVM();
  const [recordType, setRecordType] = useState<'heartRate' | 'bloodPressure' | 'temperature'>('heartRate');
  const [value, setValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const recordTypes = {
    heartRate: { label: 'Heart Rate', unit: 'bpm', placeholder: '72' },
    bloodPressure: { label: 'Blood Pressure', unit: 'mmHg', placeholder: '120' },
    temperature: { label: 'Temperature', unit: '°F', placeholder: '98.6' },
  };

  const handleAddRecord = async () => {
    if (!value || !isInitialized) return;

    setIsProcessing(true);
    try {
      const encrypted = await encrypt32(Number(Math.round(parseFloat(value) * 10)));
      if (!encrypted) {
        throw new Error('Encryption failed');
      }

      const record: MedicalRecord = {
        id: Math.random().toString(36).substring(7),
        type: recordTypes[recordType].label,
        value: '****',
        encrypted: true,
        timestamp: new Date().toLocaleString(),
      };

      setRecords([record, ...records]);
      setValue('');
    } catch (error: any) {
      console.error('Record error:', error);
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
    <Card title="🏥 Private Medical Records">
      <div className="space-y-6">
        {/* Record Type Selection */}
        <div>
          <label className="block text-white font-semibold mb-3">
            Record Type:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(recordTypes) as Array<keyof typeof recordTypes>).map((type) => (
              <button
                key={type}
                onClick={() => setRecordType(type)}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  recordType === type
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="text-sm">{recordTypes[type].label}</div>
                <div className="text-xs opacity-70">{recordTypes[type].unit}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Value Input */}
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={recordTypes[recordType].placeholder}
          label={`${recordTypes[recordType].label} (${recordTypes[recordType].unit})`}
          helperText="Value will be encrypted before storage"
        />

        <Button
          variant="primary"
          onClick={handleAddRecord}
          disabled={!value}
          isLoading={isProcessing}
          className="w-full"
        >
          Add Encrypted Record
        </Button>

        {/* Records List */}
        <div>
          <h3 className="text-white font-semibold mb-3">Medical Records:</h3>
          {records.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No records yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                      {record.type}
                    </span>
                    <span className="text-white font-mono text-lg">****</span>
                  </div>
                  <p className="text-gray-400 text-xs">{record.timestamp}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-green-400 text-xs">Encrypted</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400 text-xs">ID: {record.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2">HIPAA Compliance:</h4>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>All health data encrypted at rest</li>
            <li>Encrypted computation for analysis</li>
            <li>Access control via smart contracts</li>
            <li>Audit trail for all accesses</li>
            <li>Patient privacy guaranteed by FHE</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
