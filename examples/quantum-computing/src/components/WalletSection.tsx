import './WalletSection.css';

interface WalletSectionProps {
  address: string | null;
  isConnected: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

export default function WalletSection({
  address,
  isConnected,
  onConnect,
  onDisconnect
}: WalletSectionProps) {
  return (
    <div className="card wallet-card">
      <h2>👛 Wallet Connection</h2>
      {!isConnected ? (
        <div className="wallet-disconnect">
          <p>Connect your wallet to interact with quantum computing contracts</p>
          <button className="btn btn-primary" onClick={onConnect}>
            Connect MetaMask
          </button>
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Connected</span>
            </div>
            <div className="address">
              <strong>Address:</strong>
              <code>{address?.slice(0, 6)}...{address?.slice(-4)}</code>
            </div>
          </div>
          <button className="btn btn-danger" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
