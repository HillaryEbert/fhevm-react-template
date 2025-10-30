import { useState } from 'react';
import './QuantumStateSection.css';

interface QuantumStateSectionProps {
  send: (method: string, args: any[]) => Promise<any>;
  setStatus: (status: string) => void;
}

export default function QuantumStateSection({ send, setStatus }: QuantumStateSectionProps) {
  const [qubitCount, setQubitCount] = useState(3);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async () => {
    try {
      setIsInitializing(true);
      setStatus('Initializing quantum state...');

      // Initialize with |000...0⟩ state
      const stateSize = Math.pow(2, qubitCount);
      const amplitudes = Array(stateSize).fill(0);
      amplitudes[0] = 255; // Set first amplitude to max

      const tx = await send('initializeQuantumState', [amplitudes, qubitCount]);
      await tx.wait();

      setStatus(`✅ Quantum state initialized with ${qubitCount} qubits!`);
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="card">
      <h2>⚛️ Initialize Quantum State</h2>
      <p className="description">
        Initialize a quantum state with encrypted amplitudes. The state will be created
        in the |000...0⟩ configuration.
      </p>

      <div className="form-group">
        <label>Number of Qubits (1-8):</label>
        <input
          type="number"
          min="1"
          max="8"
          value={qubitCount}
          onChange={(e) => setQubitCount(parseInt(e.target.value))}
        />
        <small>State size: 2^{qubitCount} = {Math.pow(2, qubitCount)} amplitudes</small>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleInitialize}
        disabled={isInitializing}
      >
        {isInitializing ? (
          <>
            <span className="loading-spinner"></span>
            Initializing...
          </>
        ) : (
          'Initialize Quantum State'
        )}
      </button>
    </div>
  );
}
