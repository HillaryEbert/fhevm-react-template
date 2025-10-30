import { useState } from 'react';
import { useFhevm, useWallet, useContract } from '@quantum-privacy/fhevm-sdk';
import Header from './components/Header';
import WalletSection from './components/WalletSection';
import QuantumStateSection from './components/QuantumStateSection';
import AlgorithmSection from './components/AlgorithmSection';
import JobSection from './components/JobSection';
import './App.css';

const CONTRACT_ADDRESS = '0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2';

const CONTRACT_ABI = [
  'function initializeQuantumState(uint8[] calldata amplitudes, uint8 qubitCount) external',
  'function submitQuantumJob(uint8 encryptedInput, uint8 algorithmType) external returns (uint256)',
  'function executeQuantumAlgorithm(uint256 jobId) external',
  'function getJobInfo(uint256 jobId) external view returns (address, uint8, bool, bool, uint256, uint256, uint256)',
  'event QuantumJobSubmitted(uint256 indexed jobId, address indexed submitter, uint8 algorithmType)',
  'event QuantumJobCompleted(uint256 indexed jobId, address indexed submitter)',
];

function App() {
  const { isReady } = useFhevm();
  const { address, isConnected, connect, disconnect } = useWallet();
  const { send, call } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const [status, setStatus] = useState('');

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing FHEVM...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <div className="container">
        <WalletSection
          address={address}
          isConnected={isConnected}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        {isConnected && (
          <>
            <QuantumStateSection
              send={send}
              setStatus={setStatus}
            />
            <AlgorithmSection
              send={send}
              setStatus={setStatus}
            />
            <JobSection
              call={call}
              setStatus={setStatus}
            />
          </>
        )}

        {status && (
          <div className={`status-message ${status.startsWith('✅') ? 'success' : status.startsWith('❌') ? 'error' : 'info'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
