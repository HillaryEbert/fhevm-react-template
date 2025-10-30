import { useState } from 'react';
import './AlgorithmSection.css';

interface AlgorithmSectionProps {
  send: (method: string, args: any[]) => Promise<any>;
  setStatus: (status: string) => void;
}

const ALGORITHMS = [
  { value: 0, name: "Shor's Algorithm", desc: "Integer factorization" },
  { value: 1, name: "Grover's Search", desc: "Unstructured search" },
  { value: 2, name: "VQE", desc: "Variational Quantum Eigensolver" },
  { value: 3, name: "QAOA", desc: "Quantum Optimization" },
  { value: 4, name: "Quantum ML", desc: "Quantum Machine Learning" },
  { value: 5, name: "Custom Circuit", desc: "User-defined operations" },
];

export default function AlgorithmSection({ send, setStatus }: AlgorithmSectionProps) {
  const [algorithm, setAlgorithm] = useState(0);
  const [inputValue, setInputValue] = useState(42);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setStatus('Submitting quantum job...');

      const tx = await send('submitQuantumJob', [inputValue, algorithm]);
      const receipt = await tx.wait();

      // Try to extract job ID from events
      const jobId = receipt.events?.find((e: any) => e.event === 'QuantumJobSubmitted')?.args?.jobId;

      setStatus(`✅ Quantum job submitted! ${jobId ? `Job ID: ${jobId.toString()}` : 'Check console for details'}`);
      console.log('Transaction receipt:', receipt);
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>🧮 Submit Quantum Algorithm</h2>
      <p className="description">
        Submit an encrypted quantum computation job to the blockchain
      </p>

      <div className="algorithm-grid">
        {ALGORITHMS.map((alg) => (
          <button
            key={alg.value}
            className={`algorithm-btn ${algorithm === alg.value ? 'active' : ''}`}
            onClick={() => setAlgorithm(alg.value)}
          >
            <div className="algorithm-name">{alg.name}</div>
            <div className="algorithm-desc">{alg.desc}</div>
          </button>
        ))}
      </div>

      <div className="form-group">
        <label>Input Value (0-255):</label>
        <input
          type="number"
          min="0"
          max="255"
          value={inputValue}
          onChange={(e) => setInputValue(parseInt(e.target.value))}
        />
      </div>

      <button
        className="btn btn-success"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading-spinner"></span>
            Submitting...
          </>
        ) : (
          'Submit Job'
        )}
      </button>
    </div>
  );
}
