// Deploy script for QuantumPrivacyCompute contract
const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  console.log("Network:", hre.network.name);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy QuantumPrivacyCompute
  console.log("\n📦 Deploying QuantumPrivacyCompute...");
  const QuantumPrivacyCompute = await hre.ethers.getContractFactory("QuantumPrivacyCompute");
  const contract = await QuantumPrivacyCompute.deploy();

  await contract.deployed();

  console.log("✅ QuantumPrivacyCompute deployed to:", contract.address);

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contract.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: contract.deployTransaction.blockNumber
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📄 Deployment info saved to deployment.json");
  console.log("\n🎉 Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Update the contract address in your frontend");
  console.log("2. Verify the contract on Etherscan (optional):");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
