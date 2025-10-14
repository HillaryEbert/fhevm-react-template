import React from 'react';
import ReactDOM from 'react-dom/client';
import { FhevmProvider } from '@quantum-privacy/fhevm-sdk';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FhevmProvider config={{ chainId: 11155111 }}>
      <App />
    </FhevmProvider>
  </React.StrictMode>
);
