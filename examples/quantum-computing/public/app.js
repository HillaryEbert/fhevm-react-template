// fhEVM 新网关 API 集成
let provider;
let signer;
let contract;
let fhevmInstance;
let userAddress;

// Contract ABI - QuantumPrivacyCompute
const CONTRACT_ABI = [
    "function initializeQuantumState(uint8[] calldata _amplitudes, uint8 _qubitCount) external",
    "function submitQuantumJob(uint8 _encryptedInput, uint8 _algorithmType) external returns (uint256)",
    "function executeQuantumAlgorithm(uint256 _jobId) external",
    "function createEntanglement(address _partner) external",
    "function compileQuantumCircuit(uint256 _circuitId, uint8[] calldata _gateTypes, uint8[] calldata _targetQubits, uint8[] calldata _controlQubits) external",
    "function getJobResult(uint256 _jobId) external view returns (bytes memory)",
    "function getJobInfo(uint256 _jobId) external view returns (address submitter, uint8 algorithmType, bool isCompleted, bool isVerified, uint256 submitTime, uint256 completeTime, uint256 gasUsed)",
    "function getQuantumStateInfo(address _user) external view returns (uint8 qubitCount, bool isEntangled, uint256 timestamp)",
    "function getUserJobHistory(address _user) external view returns (uint256[] memory)",
    "function getCircuitInfo(uint256 _circuitId) external view returns (uint8[] memory gateTypes, uint8[] memory targetQubits, bool isCompiled, uint256 depth)",
    "function isDecryptionAllowed() external view returns (bool)",
    "function requestJobDecryption(uint256 _jobId) external returns (uint256)",
    "function getPauserCount() external pure returns (uint256)",
    "function isSindCpadEnabled() external pure returns (bool)",
    "event QuantumJobSubmitted(uint256 indexed jobId, address indexed submitter, uint8 algorithmType)",
    "event QuantumJobCompleted(uint256 indexed jobId, address indexed submitter)",
    "event QuantumStateInitialized(address indexed user, uint8 qubitCount)",
    "event EntanglementCreated(address indexed user1, address indexed user2)",
    "event CircuitCompiled(uint256 indexed circuitId, uint256 depth)",
    "event QuantumResultDecrypted(uint256 indexed requestId, uint8 decryptedValue)"
];

// Contract address
const CONTRACT_ADDRESS = "0xF7d1BFA0fa5b68099F5Cc85856515F7b290c92e2";

// 初始化
async function init() {
    try {
        console.log('Starting initialization...');

        if (typeof window.ethereum === 'undefined') {
            showError('Please install MetaMask wallet');
            document.getElementById('walletStatus').textContent = 'MetaMask Not Installed';
            return;
        }

        console.log('MetaMask detected');
        addLog('✅ Page loaded. Click "Connect Wallet" to start.', 'success');

        // 不自动连接钱包，等待用户手动点击

    } catch (error) {
        console.error('Initialization error:', error);
        showError('Initialization failed: ' + error.message);
    }
}

// 连接钱包
async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            throw new Error('Please install MetaMask');
        }

        addLog('Requesting wallet connection...', 'info');

        // Request account connection
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Use ethers v5 syntax
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        const network = await provider.getNetwork();

        document.getElementById('walletStatus').textContent = 'Connected';
        document.getElementById('accountAddress').textContent =
            userAddress.substring(0, 6) + '...' + userAddress.substring(38);
        document.getElementById('networkInfo').textContent =
            `${network.name} (Chain ID: ${network.chainId})`;

        if (CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            document.getElementById('contractAddress').textContent =
                CONTRACT_ADDRESS.substring(0, 6) + '...' + CONTRACT_ADDRESS.substring(38);
        }

        addLog('✅ Wallet connected successfully', 'success');

        // Initialize fhEVM after wallet connection
        console.log('Initializing fhEVM...');
        await initFhEVM();

        // Setup event listeners
        setupEventListeners();

        // Check if decryption is allowed
        try {
            const allowed = await contract.isDecryptionAllowed();
            addLog(`Decryption allowed: ${allowed}`, 'info');
        } catch (e) {
            console.log('Could not check decryption status:', e);
        }

        addLog('✅ All systems ready', 'success');

    } catch (error) {
        console.error('Wallet connection error:', error);
        addLog('❌ ' + error.message, 'error');
        throw error;
    }
}

// Initialize fhEVM
async function initFhEVM() {
    try {
        // Check if fhevmjs library is loaded
        if (typeof window.fhevm === 'undefined') {
            console.warn('fhevmjs library not loaded, skipping FHE initialization');
            addLog('⚠️ FHE functionality not enabled (library not loaded)', 'info');
            return;
        }

        const network = await provider.getNetwork();
        console.log('Current network:', network.chainId);

        try {
            fhevmInstance = await window.fhevm.createInstance({
                chainId: network.chainId,
                publicKey: await getFHEPublicKey(network.chainId),
                gatewayUrl: getGatewayUrl(network.chainId),
            });

            addLog('fhEVM instance initialized successfully', 'info');
        } catch (fheError) {
            console.warn('FHE initialization failed, but continuing:', fheError);
            addLog('⚠️ FHE initialization failed, some features may be unavailable', 'info');
        }
    } catch (error) {
        console.error('initFhEVM error:', error);
        throw new Error('fhEVM initialization failed: ' + error.message);
    }
}

// Setup event listeners
function setupEventListeners() {
    if (!contract) return;

    // Listen to QuantumJobSubmitted event
    contract.on("QuantumJobSubmitted", (jobId, submitter, algorithmType, event) => {
        addEventLog('QuantumJobSubmitted', {
            jobId: jobId.toString(),
            submitter: submitter,
            algorithmType: algorithmType.toString(),
            txHash: event.transactionHash
        });
    });

    // Listen to QuantumJobCompleted event
    contract.on("QuantumJobCompleted", (jobId, submitter, event) => {
        addEventLog('QuantumJobCompleted', {
            jobId: jobId.toString(),
            submitter: submitter,
            txHash: event.transactionHash
        });
    });

    // Listen to QuantumStateInitialized event
    contract.on("QuantumStateInitialized", (user, qubitCount, event) => {
        addEventLog('QuantumStateInitialized', {
            user: user,
            qubitCount: qubitCount.toString(),
            txHash: event.transactionHash
        });
    });

    addLog('Event listeners set up', 'info');
}

// Initialize Quantum State
async function storeEncryptedData() {
    try {
        const value = document.getElementById('storeValue').value;
        if (!value) {
            showError('Please enter a value');
            return;
        }

        if (!contract) {
            showError('Please connect wallet first');
            return;
        }

        showLoading('storeResult', 'Initializing quantum state...');

        // Convert value to amplitude array for 3 qubits (8 amplitudes)
        const qubitCount = 3;
        const stateSize = Math.pow(2, qubitCount); // 8 amplitudes
        const amplitudes = new Array(stateSize).fill(0);

        // Set the value as the first amplitude (simple encoding)
        const amplitudeValue = parseInt(value) % 256; // Ensure 0-255 range
        amplitudes[0] = amplitudeValue;

        addLog('Calling initializeQuantumState...', 'info');

        // Call contract initializeQuantumState function
        const tx = await contract.initializeQuantumState(amplitudes, qubitCount);
        addLog(`Transaction sent: ${tx.hash}`, 'info');

        showLoading('storeResult', 'Waiting for confirmation...');
        const receipt = await tx.wait();

        // Get quantum state info after transaction
        const stateInfo = await contract.getQuantumStateInfo(userAddress);

        showResult('storeResult', [
            { label: 'Amplitude Value', value: amplitudeValue },
            { label: 'Qubit Count', value: qubitCount },
            { label: 'Transaction Hash', value: tx.hash },
            { label: 'Block Number', value: receipt.blockNumber },
            { label: 'State Initialized', value: stateInfo[0] > 0 ? 'Yes' : 'No' }
        ]);

        addLog(`✅ Quantum state initialized successfully`, 'success');
    } catch (error) {
        console.error('Initialization failed:', error);
        showError('Initialization failed: ' + error.message);
        hideLoading('storeResult');
    }
}

// Request Job Decryption (NEW Gateway API)
async function requestDecryption() {
    try {
        const jobId = document.getElementById('decryptDataId').value;
        if (!jobId) {
            showError('Please enter Job ID');
            return;
        }

        if (!contract) {
            showError('Please connect wallet first');
            return;
        }

        showLoading('decryptResult', 'Requesting job decryption...');

        // Check if decryption is allowed first
        const allowed = await contract.isDecryptionAllowed();
        if (!allowed) {
            showError('Decryption is not allowed at this time');
            hideLoading('decryptResult');
            return;
        }

        // Request job decryption
        const tx = await contract.requestJobDecryption(jobId);
        addLog(`Decryption request sent: ${tx.hash}`, 'info');

        showLoading('decryptResult', 'Waiting for confirmation...');
        const receipt = await tx.wait();

        // Parse events to get request ID
        let requestId = 'Unknown';
        for (const log of receipt.logs) {
            try {
                const parsed = contract.interface.parseLog(log);
                if (parsed.name === 'QuantumResultDecrypted') {
                    requestId = parsed.args[0].toString();
                    break;
                }
            } catch (e) {
                // Skip unparseable logs
            }
        }

        showResult('decryptResult', [
            { label: 'Request ID', value: requestId },
            { label: 'Job ID', value: jobId },
            { label: 'Transaction Hash', value: tx.hash },
            { label: 'Status', value: 'Waiting for KMS response...' }
        ]);

        addLog(`✅ Decryption request submitted, Request ID: ${requestId}`, 'success');
        addLog('💡 Waiting for KMS to emit decryption event...', 'info');

        // Listen for decryption result event
        const filter = contract.filters.QuantumResultDecrypted(requestId);
        contract.once(filter, (reqId, decryptedValue) => {
            showResult('decryptResult', [
                { label: 'Request ID', value: reqId.toString() },
                { label: 'Job ID', value: jobId },
                { label: 'Decrypted Value', value: decryptedValue.toString() },
                { label: 'Status', value: '✅ Decryption Complete' }
            ]);
            addLog(`🎉 Decryption complete, Value: ${decryptedValue.toString()}`, 'success');
        });

    } catch (error) {
        console.error('Decryption request failed:', error);
        showError('Decryption request failed: ' + error.message);
        hideLoading('decryptResult');
    }
}

// Submit and Execute Quantum Job
async function computeSum() {
    try {
        const input1 = document.getElementById('computeId1').value;
        const algorithmType = document.getElementById('computeId2').value;

        if (!input1 || !algorithmType) {
            showError('Please enter input value and algorithm type');
            return;
        }

        if (!contract) {
            showError('Please connect wallet first');
            return;
        }

        const inputValue = parseInt(input1);
        const algType = parseInt(algorithmType);

        if (inputValue < 0 || inputValue > 255) {
            showError('Input must be between 0 and 255');
            return;
        }

        if (algType < 0 || algType > 5) {
            showError('Algorithm type must be between 0 and 5');
            return;
        }

        showLoading('computeResult', 'Submitting quantum job...');

        const tx = await contract.submitQuantumJob(inputValue, algType);
        addLog(`Transaction sent: ${tx.hash}`, 'info');

        showLoading('computeResult', 'Waiting for confirmation...');
        const receipt = await tx.wait();

        // Parse job ID from events
        let jobId = 'Unknown';
        for (const log of receipt.logs) {
            try {
                const parsed = contract.interface.parseLog(log);
                if (parsed.name === 'QuantumJobSubmitted') {
                    jobId = parsed.args[0].toString();
                    break;
                }
            } catch (e) {
                // Skip unparseable logs
            }
        }

        const algNames = ['Shor', 'Grover', 'VQE', 'QAOA', 'Quantum ML', 'Custom'];

        showResult('computeResult', [
            { label: 'Job ID', value: jobId },
            { label: 'Input Value', value: inputValue },
            { label: 'Algorithm', value: algNames[algType] || 'Unknown' },
            { label: 'Transaction Hash', value: tx.hash },
            { label: 'Status', value: 'Submitted (ready to execute)' }
        ]);

        addLog(`✅ Quantum job submitted, Job ID: ${jobId}`, 'success');
    } catch (error) {
        console.error('Job submission failed:', error);
        showError('Job submission failed: ' + error.message);
        hideLoading('computeResult');
    }
}

// Query Job Information
async function queryDataInfo() {
    try {
        const jobId = document.getElementById('queryDataId').value;
        if (!jobId) {
            showError('Please enter Job ID');
            return;
        }

        if (!contract) {
            showError('Please connect wallet first');
            return;
        }

        showLoading('queryResult', 'Querying job info...');

        const jobInfo = await contract.getJobInfo(jobId);

        const algNames = ['Shor', 'Grover', 'VQE', 'QAOA', 'Quantum ML', 'Custom'];
        const submitter = jobInfo[0];
        const algorithmType = jobInfo[1];
        const isCompleted = jobInfo[2];
        const isVerified = jobInfo[3];
        const submitTime = jobInfo[4];
        const completeTime = jobInfo[5];
        const gasUsed = jobInfo[6];

        if (submitter === ethers.constants.AddressZero) {
            showResult('queryResult', [
                { label: 'Status', value: 'Job does not exist' }
            ]);
            return;
        }

        showResult('queryResult', [
            { label: 'Job ID', value: jobId },
            { label: 'Submitter', value: `${submitter.slice(0, 6)}...${submitter.slice(-4)}` },
            { label: 'Algorithm', value: algNames[algorithmType] || 'Unknown' },
            { label: 'Completed', value: isCompleted ? 'Yes' : 'No' },
            { label: 'Verified', value: isVerified ? 'Yes' : 'No' },
            { label: 'Submit Time', value: new Date(Number(submitTime) * 1000).toLocaleString() },
            { label: 'Complete Time', value: completeTime > 0 ? new Date(Number(completeTime) * 1000).toLocaleString() : 'N/A' },
            { label: 'Gas Used', value: gasUsed.toString() }
        ]);

        addLog(`Query successful: Job ${jobId}`, 'info');
    } catch (error) {
        console.error('Query failed:', error);
        showError('Query failed: ' + error.message);
        hideLoading('queryResult');
    }
}

// 工具函数
function getFHEPublicKey(chainId) {
    // 根据链 ID 返回相应的 FHE 公钥
    const keys = {
        9000: 'YOUR_PUBLIC_KEY_FOR_SEPOLIA',
        8009: 'YOUR_PUBLIC_KEY_FOR_LOCALHOST',
    };
    return keys[chainId] || keys[9000];
}

function getGatewayUrl(chainId) {
    const urls = {
        9000: 'https://gateway.sepolia.zama.ai',
        8009: 'http://localhost:8009',
    };
    return urls[chainId] || urls[9000];
}

function showLoading(elementId, message) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    element.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div class="loading"></div>
            <p style="margin-top: 10px; color: #666;">${message}</p>
        </div>
    `;
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

function showResult(elementId, items) {
    const element = document.getElementById(elementId);
    const content = document.getElementById(elementId + 'Content');

    content.innerHTML = items.map(item => `
        <div class="result-item">
            <strong>${item.label}:</strong> ${item.value}
        </div>
    `).join('');

    element.style.display = 'block';
}

function showError(message) {
    addLog('❌ ' + message, 'error');
    alert(message); // 添加弹窗提示
}

function addLog(message, type = 'info') {
    console.log(`[${type}] ${message}`);

    // 在事件日志中也显示系统消息
    const logContainer = document.getElementById('eventLog');
    if (logContainer) {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        const colors = {
            'info': '#667eea',
            'success': '#4caf50',
            'error': '#f44336'
        };

        eventItem.innerHTML = `
            <div class="event-type" style="color: ${colors[type] || colors.info}">系统消息</div>
            <div class="event-data">${message}</div>
            <div class="event-data" style="margin-top: 5px; color: #999;">
                ${new Date().toLocaleTimeString()}
            </div>
        `;

        logContainer.insertBefore(eventItem, logContainer.firstChild);

        // 限制显示的事件数量
        while (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
}

function addEventLog(eventType, data) {
    const logContainer = document.getElementById('eventLog');
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';

    const dataStr = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>');

    eventItem.innerHTML = `
        <div class="event-type">${eventType}</div>
        <div class="event-data">${dataStr}</div>
        <div class="event-data" style="margin-top: 5px; color: #999;">
            ${new Date().toLocaleTimeString()}
        </div>
    `;

    logContainer.insertBefore(eventItem, logContainer.firstChild);

    // 限制显示的事件数量
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// 页面加载时初始化
window.addEventListener('load', init);

// 监听账户变化
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            location.reload();
        } else {
            location.reload();
        }
    });

    window.ethereum.on('chainChanged', () => {
        location.reload();
    });
}
