'use client';

import { useWallet, useEncrypt, useContract } from '@quantum-privacy/fhevm-sdk';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2';
const CONTRACT_ABI = [
  'function initializeQuantumState(uint8[] calldata amplitudes, uint8 qubitCount) external',
  'function submitQuantumJob(uint8 encryptedInput, uint8 algorithmType) external returns (uint256)',
  'function getJobInfo(uint256 jobId) external view returns (address, uint8, bool, bool, uint256, uint256, uint256)',
];

export default function Home() {
  const { connect, disconnect, address, isConnected } = useWallet();
  const { encrypt, isEncrypting } = useEncrypt();
  const { call, send, isLoading } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [inputValue, setInputValue] = useState('42');
  const [algorithmType, setAlgorithmType] = useState('0');
  const [jobId, setJobId] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmitJob = async () => {
    try {
      const tx = await send('submitQuantumJob', [parseInt(inputValue), parseInt(algorithmType)]);
      const receipt = await tx.wait();
      console.log('Job submitted:', receipt);
      setResult({ success: true, message: 'Job submitted successfully!' });
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, message: (error as Error).message });
    }
  };

  const handleQueryJob = async () => {
    try {
      const info = await call('getJobInfo', [jobId]);
      console.log('Job info:', info);
      setResult({
        success: true,
        jobInfo: {
          submitter: info[0],
          algorithm: info[1],
          completed: info[2],
          verified: info[3],
        },
      });
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, message: (error as Error).message });
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>🔒 FHEVM Next.js Demo</h1>
        <p>Quantum Privacy Computing with Next.js and @quantum-privacy/fhevm-sdk</p>
      </header>

      <div className="card">
        <h2>👛 Wallet Connection</h2>
        <button onClick={isConnected ? disconnect : connect} className="btn">
          {isConnected ? `Disconnect: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      {isConnected && (
        <>
          <div className="card">
            <h2>🧮 Submit Quantum Job</h2>
            <div className="form-group">
              <label>Input Value (0-255):</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                max="255"
              />
            </div>
            <div className="form-group">
              <label>Algorithm Type:</label>
              <select value={algorithmType} onChange={(e) => setAlgorithmType(e.target.value)}>
                <option value="0">Shor's Algorithm</option>
                <option value="1">Grover's Search</option>
                <option value="2">VQE</option>
                <option value="3">QAOA</option>
                <option value="4">Quantum ML</option>
                <option value="5">Custom Circuit</option>
              </select>
            </div>
            <button onClick={handleSubmitJob} disabled={isLoading} className="btn">
              {isLoading ? 'Submitting...' : 'Submit Job'}
            </button>
          </div>

          <div className="card">
            <h2>📊 Query Job</h2>
            <div className="form-group">
              <label>Job ID:</label>
              <input
                type="number"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Enter job ID"
              />
            </div>
            <button onClick={handleQueryJob} disabled={isLoading} className="btn">
              {isLoading ? 'Querying...' : 'Query Job'}
            </button>
          </div>

          {result && (
            <div className={`result ${result.success ? 'success' : 'error'}`}>
              <h3>{result.success ? '✅ Success' : '❌ Error'}</h3>
              {result.message && <p>{result.message}</p>}
              {result.jobInfo && (
                <div className="job-info">
                  <p><strong>Submitter:</strong> {result.jobInfo.submitter}</p>
                  <p><strong>Algorithm:</strong> {result.jobInfo.algorithm}</p>
                  <p><strong>Completed:</strong> {result.jobInfo.completed ? 'Yes' : 'No'}</p>
                  <p><strong>Verified:</strong> {result.jobInfo.verified ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>Built with @quantum-privacy/fhevm-sdk</p>
        <p>
          <a href="https://github.com/your-username/fhevm-universal-sdk" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
