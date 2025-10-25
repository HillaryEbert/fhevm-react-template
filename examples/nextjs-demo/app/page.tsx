'use client';

import { useFHEVM } from '@fhevm/sdk/react';
import { useState } from 'react';
import EncryptionDemo from './components/EncryptionDemo';
import ContractInteraction from './components/ContractInteraction';
import StatusBar from './components/StatusBar';

export default function Home() {
  const { isInitialized, isInitializing, error, init } = useFHEVM();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'contract'>('encrypt');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🔐 FHEVM SDK
              </h1>
              <p className="text-gray-300 mt-1">
                Universal SDK for React, Vue, Next.js & Node.js
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                Next.js
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">
                React Hooks
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-sm">
                TypeScript
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <StatusBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Initialization Status */}
        {!isInitialized && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="text-center">
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Initializing FHEVM...
                  </h2>
                  <p className="text-gray-300">
                    Connecting to wallet and loading FHE public key
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Ready to Start
                  </h2>
                  <button
                    onClick={init}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Connect Wallet & Initialize
                  </button>
                </>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200">
                    ❌ Error: {error.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        {isInitialized && (
          <>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('encrypt')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'encrypt'
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🔐 Encryption Demo
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'contract'
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📄 Contract Interaction
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {activeTab === 'encrypt' && <EncryptionDemo />}
              {activeTab === 'contract' && <ContractInteraction />}
            </div>
          </>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">⚛️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              React Hooks
            </h3>
            <p className="text-gray-300">
              Simple and intuitive hooks like useFHEVM and useContract for easy integration
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              FHE Encryption
            </h3>
            <p className="text-gray-300">
              Support for all FHE types: 8/16/32/64/128/256-bit integers, booleans, and addresses
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Multi-Framework
            </h3>
            <p className="text-gray-300">
              Works with React, Vue, Next.js, and Node.js - one SDK for all
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
          <p>Built with ❤️ for Zama FHE Ecosystem</p>
          <p className="mt-2">
            <a href="https://www.zama.ai/" target="_blank" rel="noopener" className="text-purple-400 hover:text-purple-300">
              Zama.ai
            </a>
            {' · '}
            <a href="https://github.com" target="_blank" rel="noopener" className="text-purple-400 hover:text-purple-300">
              GitHub
            </a>
            {' · '}
            <a href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener" className="text-purple-400 hover:text-purple-300">
              Documentation
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
