import { useState } from 'react';
import { useWallet, useEncrypt, useContract, useFhevm } from '@quantum-privacy/fhevm-sdk';
import './App.css';

const CONTRACT_ADDRESS = '0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2';
const CONTRACT_ABI = [
  'function initializeQuantumState(uint8[] calldata amplitudes, uint8 qubitCount) external',
  'function submitQuantumJob(uint8 encryptedInput, uint8 algorithmType) external returns (uint256)',
  'function executeQuantumAlgorithm(uint256 jobId) external',
  'function getJobInfo(uint256 jobId) external view returns (address, uint8, bool, bool, uint256, uint256, uint256)',
];

function App() {
  const { isReady } = useFhevm();
  const { connect, disconnect, address, isConnected, balance } = useWallet();
  const { encrypt, isEncrypting } = useEncrypt();
  const { send, call, isLoading } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [value, setValue] = useState('42');
  const [algorithm, setAlgorithm] = useState('0');
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('');

  const handleInitState = async () => {
    try {
      setStatus('Initializing quantum state...');
      const amplitudes = [255, 0, 0, 0, 0, 0, 0, 0];
      const tx = await send('initializeQuantumState', [amplitudes, 3]);
      await tx.wait();
      setStatus('✅ Quantum state initialized!');
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
    }
  };

  const handleSubmitJob = async () => {
    try {
      setStatus('Submitting quantum job...');
      const tx = await send('submitQuantumJob', [parseInt(value), parseInt(algorithm)]);
      const receipt = await tx.wait();
      setStatus('✅ Job submitted! Check console for job ID');
      console.log('Receipt:', receipt);
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
    }
  };

  const handleQueryJob = async () => {
    try {
      setStatus('Querying job...');
      const info = await call('getJobInfo', [jobId]);
      setStatus(`✅ Job Info: Completed=${info[2]}, Verified=${info[3]}`);
      console.log('Job Info:', info);
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
    }
  };

  if (!isReady) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading FHEVM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔒 FHEVM React Demo</h1>
        <p>Quantum Privacy Computing with React and @quantum-privacy/fhevm-sdk</p>
      </header>

      <div className="card">
        <h2>👛 Wallet</h2>
        {!isConnected ? (
          <button onClick={connect} className="btn">
            Connect Wallet
          </button>
        ) : (
          <div>
            <p><strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
            <button onClick={disconnect} className="btn btn-secondary">
              Disconnect
            </button>
          </div>
        )}
      </div>

      {isConnected && (
        <>
          <div className="card">
            <h2>⚛️ Initialize Quantum State</h2>
            <p>Initialize a 3-qubit quantum state with encrypted amplitudes</p>
            <button onClick={handleInitState} disabled={isLoading} className="btn">
              {isLoading ? 'Initializing...' : 'Initialize State'}
            </button>
          </div>

          <div className="card">
            <h2>🧮 Submit Quantum Job</h2>
            <div className="form-group">
              <label>Input Value (0-255):</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="0"
                max="255"
              />
            </div>
            <div className="form-group">
              <label>Algorithm:</label>
              <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
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
              {isLoading ? 'Querying...' : 'Query Job Info'}
            </button>
          </div>

          {status && (
            <div className={`status ${status.startsWith('✅') ? 'success' : status.startsWith('❌') ? 'error' : 'info'}`}>
              {status}
            </div>
          )}
        </>
      )}

      <footer className="footer">
        <p>Built with @quantum-privacy/fhevm-sdk</p>
        <a href="https://github.com/your-username/fhevm-universal-sdk" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
