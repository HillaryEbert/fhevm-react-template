// Compile contracts and generate ABIs
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🔨 Compiling contracts...");

  // Compile contracts
  await hre.run('compile');

  console.log("✅ Contracts compiled successfully!");

  // Copy ABIs to public directory for frontend use
  const artifactsPath = path.join(__dirname, '../artifacts/contracts');
  const publicPath = path.join(__dirname, '../public/abis');

  // Create public/abis directory if it doesn't exist
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  // Copy main contract ABI
  const contractPath = path.join(artifactsPath, 'QuantumPrivacyCompute.sol/QuantumPrivacyCompute.json');
  if (fs.existsSync(contractPath)) {
    const artifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    fs.writeFileSync(
      path.join(publicPath, 'QuantumPrivacyCompute.json'),
      JSON.stringify({ abi: artifact.abi }, null, 2)
    );
    console.log("📋 ABI copied to public/abis/QuantumPrivacyCompute.json");
  }

  console.log("\n🎉 Build complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
