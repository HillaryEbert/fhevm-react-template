import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>⚛️ Quantum Privacy Computing</h1>
        <p>Privacy-Preserving Quantum Algorithms on Encrypted Data using FHEVM</p>
        <div className="badges">
          <span className="badge">React + Vite</span>
          <span className="badge">FHEVM SDK</span>
          <span className="badge">Sepolia Testnet</span>
        </div>
      </div>
    </header>
  );
}
