<template>
  <div class="app">
    <header class="header">
      <h1>🔒 FHEVM Vue Demo</h1>
      <p>Quantum Privacy Computing with Vue and @quantum-privacy/fhevm-sdk</p>
    </header>

    <!-- Loading State -->
    <div v-if="!isReady" class="loading">
      <div class="spinner"></div>
      <p>Loading FHEVM...</p>
    </div>

    <template v-else>
      <!-- Wallet Card -->
      <div class="card">
        <h2>👛 Wallet</h2>
        <button v-if="!isConnected" @click="handleConnect" class="btn">
          Connect Wallet
        </button>
        <div v-else>
          <p><strong>Address:</strong> {{ formatAddress(address) }}</p>
          <p><strong>Balance:</strong> {{ balance }} ETH</p>
          <button @click="handleDisconnect" class="btn btn-secondary">
            Disconnect
          </button>
        </div>
      </div>

      <!-- Connected Features -->
      <template v-if="isConnected">
        <!-- Initialize Quantum State -->
        <div class="card">
          <h2>⚛️ Initialize Quantum State</h2>
          <p>Initialize a 3-qubit quantum state with encrypted amplitudes</p>
          <button @click="handleInitState" :disabled="isLoading" class="btn">
            {{ isLoading ? 'Initializing...' : 'Initialize State' }}
          </button>
        </div>

        <!-- Submit Quantum Job -->
        <div class="card">
          <h2>🧮 Submit Quantum Job</h2>
          <div class="form-group">
            <label>Input Value (0-255):</label>
            <input
              v-model.number="inputValue"
              type="number"
              min="0"
              max="255"
            />
          </div>
          <div class="form-group">
            <label>Algorithm:</label>
            <select v-model="selectedAlgorithm">
              <option value="0">Shor's Algorithm</option>
              <option value="1">Grover's Search</option>
              <option value="2">VQE</option>
              <option value="3">QAOA</option>
              <option value="4">Quantum ML</option>
              <option value="5">Custom Circuit</option>
            </select>
          </div>
          <button @click="handleSubmitJob" :disabled="isLoading" class="btn">
            {{ isLoading ? 'Submitting...' : 'Submit Job' }}
          </button>
        </div>

        <!-- Query Job -->
        <div class="card">
          <h2>📊 Query Job</h2>
          <div class="form-group">
            <label>Job ID:</label>
            <input
              v-model.number="queryJobId"
              type="number"
              placeholder="Enter job ID"
            />
          </div>
          <button @click="handleQueryJob" :disabled="isLoading" class="btn">
            {{ isLoading ? 'Querying...' : 'Query Job Info' }}
          </button>
        </div>

        <!-- Status Message -->
        <div
          v-if="statusMessage"
          :class="['status', statusClass]"
        >
          {{ statusMessage }}
        </div>
      </template>
    </template>

    <footer class="footer">
      <p>Built with @quantum-privacy/fhevm-sdk</p>
      <a href="https://github.com/your-username/fhevm-universal-sdk" target="_blank" rel="noopener noreferrer">
        View on GitHub
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ethers } from 'ethers';
import { createFhevmInstance } from '@quantum-privacy/fhevm-sdk';

const CONTRACT_ADDRESS = '0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2';
const CONTRACT_ABI = [
  'function initializeQuantumState(uint8[] calldata amplitudes, uint8 qubitCount) external',
  'function submitQuantumJob(uint8 encryptedInput, uint8 algorithmType) external returns (uint256)',
  'function executeQuantumAlgorithm(uint256 jobId) external',
  'function getJobInfo(uint256 jobId) external view returns (address, uint8, bool, bool, uint256, uint256, uint256)',
];

// State
const isReady = ref(false);
const isConnected = ref(false);
const isLoading = ref(false);
const address = ref('');
const balance = ref('0.0');
const inputValue = ref(42);
const selectedAlgorithm = ref('0');
const queryJobId = ref(0);
const statusMessage = ref('');

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;
let fhevmInstance: any = null;

// Computed
const statusClass = computed(() => {
  if (statusMessage.value.startsWith('✅')) return 'success';
  if (statusMessage.value.startsWith('❌')) return 'error';
  return 'info';
});

// Methods
const formatAddress = (addr: string) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const handleConnect = async () => {
  try {
    if (!window.ethereum) {
      statusMessage.value = '❌ Please install MetaMask';
      return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    address.value = await signer.getAddress();

    const bal = await provider.getBalance(address.value);
    balance.value = ethers.utils.formatEther(bal);

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    isConnected.value = true;
    statusMessage.value = '✅ Wallet connected!';
  } catch (error) {
    statusMessage.value = '❌ Error: ' + (error as Error).message;
  }
};

const handleDisconnect = () => {
  provider = null;
  signer = null;
  contract = null;
  address.value = '';
  balance.value = '0.0';
  isConnected.value = false;
  statusMessage.value = 'Wallet disconnected';
};

const handleInitState = async () => {
  if (!contract) return;

  try {
    isLoading.value = true;
    statusMessage.value = 'Initializing quantum state...';
    const amplitudes = [255, 0, 0, 0, 0, 0, 0, 0];
    const tx = await contract.initializeQuantumState(amplitudes, 3);
    await tx.wait();
    statusMessage.value = '✅ Quantum state initialized!';
  } catch (error) {
    statusMessage.value = '❌ Error: ' + (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const handleSubmitJob = async () => {
  if (!contract) return;

  try {
    isLoading.value = true;
    statusMessage.value = 'Submitting quantum job...';
    const tx = await contract.submitQuantumJob(
      inputValue.value,
      parseInt(selectedAlgorithm.value)
    );
    const receipt = await tx.wait();
    statusMessage.value = '✅ Job submitted! Check console for job ID';
    console.log('Receipt:', receipt);
  } catch (error) {
    statusMessage.value = '❌ Error: ' + (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const handleQueryJob = async () => {
  if (!contract) return;

  try {
    isLoading.value = true;
    statusMessage.value = 'Querying job...';
    const info = await contract.getJobInfo(queryJobId.value);
    statusMessage.value = `✅ Job Info: Completed=${info[2]}, Verified=${info[3]}`;
    console.log('Job Info:', info);
  } catch (error) {
    statusMessage.value = '❌ Error: ' + (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    fhevmInstance = await createFhevmInstance({ chainId: 11155111 });
    isReady.value = true;
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error);
    statusMessage.value = '❌ Failed to initialize FHEVM';
  }
});
</script>

<style scoped>
/* Component-specific styles can go here */
</style>
