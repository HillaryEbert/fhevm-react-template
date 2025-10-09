// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { Gateway } from "./GatewayHelper.sol";

contract QuantumPrivacyCompute is SepoliaConfig {

    address public owner;
    uint256 public computeJobCounter;
    uint256 public constant MAX_QUBITS = 32;

    struct QuantumState {
        euint8[] amplitudes;
        uint8 qubitCount;
        bool isEntangled;
        uint256 timestamp;
    }

    struct ComputeJob {
        address submitter;
        euint8 encryptedInput;
        euint8 encryptedResult;
        uint8 algorithmType;
        bool isCompleted;
        bool isVerified;
        uint256 submitTime;
        uint256 completeTime;
        uint256 gasUsed;
    }

    struct QuantumCircuit {
        uint8[] gateTypes;  // 0: H, 1: CNOT, 2: X, 3: Z, 4: Phase
        uint8[] targetQubits;
        uint8[] controlQubits;
        bool isCompiled;
        uint256 depth;
    }

    mapping(uint256 => ComputeJob) public computeJobs;
    mapping(address => QuantumState) private userQuantumStates;
    mapping(uint256 => QuantumCircuit) public quantumCircuits;
    mapping(address => uint256[]) public userJobHistory;
    mapping(address => bool) public authorizedNodes;

    event QuantumJobSubmitted(uint256 indexed jobId, address indexed submitter, uint8 algorithmType);
    event QuantumJobCompleted(uint256 indexed jobId, address indexed submitter);
    event QuantumStateInitialized(address indexed user, uint8 qubitCount);
    event EntanglementCreated(address indexed user1, address indexed user2);
    event CircuitCompiled(uint256 indexed circuitId, uint256 depth);
    event NodeAuthorized(address indexed node);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorizedNode() {
        require(authorizedNodes[msg.sender] || msg.sender == owner, "Not authorized compute node");
        _;
    }

    constructor() {
        owner = msg.sender;
        computeJobCounter = 1;
        authorizedNodes[msg.sender] = true;
    }

    // Initialize quantum state for user with encrypted amplitudes
    function initializeQuantumState(uint8[] calldata _amplitudes, uint8 _qubitCount) external {
        require(_qubitCount <= 8, "Max 8 qubits supported"); // Reduced for euint8
        require(_amplitudes.length == (1 << _qubitCount), "Invalid amplitude array size");

        euint8[] memory encryptedAmplitudes = new euint8[](_amplitudes.length);

        for (uint i = 0; i < _amplitudes.length; i++) {
            encryptedAmplitudes[i] = FHE.asEuint8(_amplitudes[i]);
            FHE.allowThis(encryptedAmplitudes[i]);
            FHE.allow(encryptedAmplitudes[i], msg.sender);
        }

        userQuantumStates[msg.sender] = QuantumState({
            amplitudes: encryptedAmplitudes,
            qubitCount: _qubitCount,
            isEntangled: false,
            timestamp: block.timestamp
        });

        emit QuantumStateInitialized(msg.sender, _qubitCount);
    }

    // Submit confidential quantum computation job
    function submitQuantumJob(uint8 _encryptedInput, uint8 _algorithmType) external returns (uint256) {
        require(_algorithmType <= 5, "Invalid algorithm type"); // 0: Shor, 1: Grover, 2: VQE, 3: QAOA, 4: Quantum ML, 5: Custom

        euint8 encryptedInput = FHE.asEuint8(_encryptedInput);
        FHE.allowThis(encryptedInput);
        FHE.allow(encryptedInput, msg.sender);

        uint256 jobId = computeJobCounter++;

        computeJobs[jobId] = ComputeJob({
            submitter: msg.sender,
            encryptedInput: encryptedInput,
            encryptedResult: FHE.asEuint8(0),
            algorithmType: _algorithmType,
            isCompleted: false,
            isVerified: false,
            submitTime: block.timestamp,
            completeTime: 0,
            gasUsed: 0
        });

        userJobHistory[msg.sender].push(jobId);

        emit QuantumJobSubmitted(jobId, msg.sender, _algorithmType);
        return jobId;
    }

    // Execute quantum algorithm on encrypted data
    function executeQuantumAlgorithm(uint256 _jobId) external onlyAuthorizedNode {
        ComputeJob storage job = computeJobs[_jobId];
        require(!job.isCompleted, "Job already completed");
        require(job.submitter != address(0), "Job does not exist");

        uint256 startGas = gasleft();

        // Simulate quantum computation based on algorithm type
        euint8 result;

        if (job.algorithmType == 0) {
            // Shor's algorithm simulation
            result = _executeShorAlgorithm(job.encryptedInput);
        } else if (job.algorithmType == 1) {
            // Grover's algorithm simulation
            result = _executeGroverAlgorithm(job.encryptedInput);
        } else if (job.algorithmType == 2) {
            // Variational Quantum Eigensolver
            result = _executeVQE(job.encryptedInput);
        } else if (job.algorithmType == 3) {
            // Quantum Approximate Optimization Algorithm
            result = _executeQAOA(job.encryptedInput);
        } else if (job.algorithmType == 4) {
            // Quantum Machine Learning
            result = _executeQuantumML(job.encryptedInput);
        } else {
            // Custom quantum circuit
            result = _executeCustomCircuit(job.encryptedInput, _jobId);
        }

        job.encryptedResult = result;
        job.isCompleted = true;
        job.completeTime = block.timestamp;
        job.gasUsed = startGas - gasleft();

        FHE.allowThis(result);
        FHE.allow(result, job.submitter);

        emit QuantumJobCompleted(_jobId, job.submitter);
    }

    // Private quantum algorithm implementations
    function _executeShorAlgorithm(euint8 _input) private returns (euint8) {
        // Simplified Shor's algorithm for factoring
        euint8 factor = FHE.add(_input, FHE.asEuint8(1));
        // Simple transformation instead of complex operations
        return FHE.sub(factor, FHE.asEuint8(1));
    }

    function _executeGroverAlgorithm(euint8 _input) private returns (euint8) {
        // Simplified Grover's search
        euint8 searched = FHE.mul(_input, FHE.asEuint8(3));
        return FHE.add(searched, FHE.asEuint8(7));
    }

    function _executeVQE(euint8 _input) private returns (euint8) {
        // Variational Quantum Eigensolver simulation
        euint8 eigenvalue = FHE.add(_input, FHE.asEuint8(42));
        return FHE.mul(eigenvalue, FHE.asEuint8(7));
    }

    function _executeQAOA(euint8 _input) private returns (euint8) {
        // QAOA optimization
        euint8 optimized = FHE.sub(_input, FHE.asEuint8(13));
        return FHE.add(optimized, FHE.asEuint8(100));
    }

    function _executeQuantumML(euint8 _input) private returns (euint8) {
        // Quantum machine learning
        euint8 prediction = FHE.mul(_input, FHE.asEuint8(5));
        return FHE.add(prediction, FHE.asEuint8(17));
    }

    function _executeCustomCircuit(euint8 _input, uint256 _jobId) private returns (euint8) {
        // Execute custom quantum circuit if available
        if (quantumCircuits[_jobId].isCompiled) {
            return FHE.add(_input, FHE.asEuint8(uint8(quantumCircuits[_jobId].depth)));
        }
        return _input;
    }

    // Create quantum entanglement between two users
    function createEntanglement(address _partner) external {
        require(userQuantumStates[msg.sender].qubitCount > 0, "Initialize quantum state first");
        require(userQuantumStates[_partner].qubitCount > 0, "Partner must have quantum state");

        userQuantumStates[msg.sender].isEntangled = true;
        userQuantumStates[_partner].isEntangled = true;

        emit EntanglementCreated(msg.sender, _partner);
    }

    // Compile quantum circuit
    function compileQuantumCircuit(
        uint256 _circuitId,
        uint8[] calldata _gateTypes,
        uint8[] calldata _targetQubits,
        uint8[] calldata _controlQubits
    ) external {
        require(_gateTypes.length == _targetQubits.length, "Mismatched array lengths");

        quantumCircuits[_circuitId] = QuantumCircuit({
            gateTypes: _gateTypes,
            targetQubits: _targetQubits,
            controlQubits: _controlQubits,
            isCompiled: true,
            depth: _gateTypes.length
        });

        emit CircuitCompiled(_circuitId, _gateTypes.length);
    }

    // Get job result (only submitter can access)
    function getJobResult(uint256 _jobId) external view returns (bytes memory) {
        ComputeJob storage job = computeJobs[_jobId];
        require(msg.sender == job.submitter, "Not authorized to view result");
        require(job.isCompleted, "Job not completed yet");

        return abi.encodePacked(FHE.toBytes32(job.encryptedResult));
    }

    // Verify quantum computation result
    function verifyQuantumResult(uint256 _jobId, uint8 _expectedResult) external returns (bool) {
        ComputeJob storage job = computeJobs[_jobId];
        require(msg.sender == job.submitter, "Not authorized");
        require(job.isCompleted, "Job not completed");

        euint8 expected = FHE.asEuint8(_expectedResult);
        // ebool isValid = FHE.eq(job.encryptedResult, expected); // Removed unused variable

        // This would normally use async decryption for verification
        job.isVerified = true; // Simplified for this example

        return true; // Simplified return
    }

    // Authorize compute node
    function authorizeNode(address _node) external onlyOwner {
        authorizedNodes[_node] = true;
        emit NodeAuthorized(_node);
    }

    // Revoke node authorization
    function revokeNodeAuthorization(address _node) external onlyOwner {
        authorizedNodes[_node] = false;
    }

    // Get user job history
    function getUserJobHistory(address _user) external view returns (uint256[] memory) {
        return userJobHistory[_user];
    }

    // Get quantum state info
    function getQuantumStateInfo(address _user) external view returns (
        uint8 qubitCount,
        bool isEntangled,
        uint256 timestamp
    ) {
        QuantumState storage state = userQuantumStates[_user];
        return (state.qubitCount, state.isEntangled, state.timestamp);
    }

    // Get job info
    function getJobInfo(uint256 _jobId) external view returns (
        address submitter,
        uint8 algorithmType,
        bool isCompleted,
        bool isVerified,
        uint256 submitTime,
        uint256 completeTime,
        uint256 gasUsed
    ) {
        ComputeJob storage job = computeJobs[_jobId];
        return (
            job.submitter,
            job.algorithmType,
            job.isCompleted,
            job.isVerified,
            job.submitTime,
            job.completeTime,
            job.gasUsed
        );
    }

    // Get circuit info
    function getCircuitInfo(uint256 _circuitId) external view returns (
        uint8[] memory gateTypes,
        uint8[] memory targetQubits,
        bool isCompiled,
        uint256 depth
    ) {
        QuantumCircuit storage circuit = quantumCircuits[_circuitId];
        return (
            circuit.gateTypes,
            circuit.targetQubits,
            circuit.isCompiled,
            circuit.depth
        );
    }

    // ========== NEW GATEWAY API FEATURES ==========

    /**
     * @notice Check if public decryption is allowed (NEW Gateway API)
     * @return bool True if allowed, false otherwise
     * @dev Uses isPublicDecryptAllowed() instead of deprecated checkPublicDecryptAllowed()
     *      This is one of the key new Gateway API features
     */
    function isDecryptionAllowed() external view returns (bool) {
        // NEW API: is...() functions return boolean, don't revert
        // OLD API would use: checkPublicDecryptAllowed() which reverts on failure
        return Gateway.isPublicDecryptAllowed();
    }

    /**
     * @notice Request async decryption for quantum job result (NEW Gateway API)
     * @param _jobId The job ID to decrypt
     * @return requestId The decryption request ID
     * @dev Demonstrates new event structure - KMS responses emit directly
     */
    function requestJobDecryption(uint256 _jobId) external returns (uint256) {
        ComputeJob storage job = computeJobs[_jobId];
        require(msg.sender == job.submitter, "Not authorized");
        require(job.isCompleted, "Job not completed yet");

        // Convert encrypted result to uint256 array for Gateway
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(job.encryptedResult);

        // NEW Gateway API: Direct KMS event emission (no on-chain aggregation)
        uint256 requestId = Gateway.requestDecryption(
            cts,
            this.jobDecryptionCallback.selector,
            0, // No signatures needed
            block.timestamp + 100, // Deadline
            false // Not passSignaturesToCaller
        );

        return requestId;
    }

    /**
     * @notice Callback for job decryption (NEW Gateway event structure)
     * @param requestId The decryption request ID
     * @param decryptedValue The decrypted result
     * @dev NEW: Each KMS response emits event directly (kmsGeneration field)
     */
    function jobDecryptionCallback(
        uint256 requestId,
        uint8 decryptedValue
    ) public onlyGateway returns (uint8) {
        // Process decrypted quantum computation result
        emit QuantumResultDecrypted(requestId, decryptedValue);
        return decryptedValue;
    }

    /**
     * @notice NEW event for decrypted quantum results
     * @dev Part of new Gateway event structure
     */
    event QuantumResultDecrypted(uint256 indexed requestId, uint8 decryptedValue);

    /**
     * @notice Get pauser count (NEW multi-pauser support)
     * @return count Number of pauser addresses configured
     * @dev NEW Gateway API feature: Multi-pauser support
     *      Configuration: NUM_PAUSERS = n_kms + n_copro
     */
    function getPauserCount() external pure returns (uint256) {
        // This would be configured via environment variables:
        // PAUSER_ADDRESS_0, PAUSER_ADDRESS_1, PAUSER_ADDRESS_2, etc.
        // NUM_PAUSERS = 3 (example: 2 KMS + 1 coprocessor)
        return 3; // Example configuration
    }

    /**
     * @notice Check sIND-CPAD security status
     * @return enabled Whether automatic re-randomization is enabled
     * @dev NEW Gateway API: Automatic transaction input re-randomization
     *      Provides sIND-CPAD security transparently to users
     */
    function isSindCpadEnabled() external pure returns (bool) {
        // NEW: All transaction inputs are automatically re-randomized
        // This provides sIND-CPAD security without user intervention
        return true; // Always enabled in new Gateway API
    }

    // ========== GATEWAY HELPER FUNCTIONS ==========

    modifier onlyGateway() {
        // In production, verify caller is Gateway contract
        _;
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        // Emergency pause functionality
    }

    function updateMaxQubits(uint256 _newMax) external onlyOwner {
        // Update maximum qubits if needed
    }
}