
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Replace with your deployed contract addresses
  const validatorAddress = "VALIDATOR_CONTRACT_ADDRESS";
  const nftMappingAddress = "NFT_MAPPING_CONTRACT_ADDRESS";
  const registryAddress = "PROPERTY_REGISTRY_ADDRESS";
  const marketplaceAddress = "MARKETPLACE_ADDRESS";

  const Validator = await hre.ethers.getContractFactory("ValidatorConsensus");
  const validator = Validator.attach(validatorAddress);

  const NFTMapping = await hre.ethers.getContractFactory("NFTMapping");
  const nftMapping = NFTMapping.attach(nftMappingAddress);

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const registry = PropertyRegistry.attach(registryAddress);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(marketplaceAddress);

  // Submit property example
  console.log("Submitting property...");
  const tx1 = await registry.submitProperty(
    "My Property",
    "QmIPFSHashExample123456",
    JSON.stringify([[20.5937,78.9629],[20.6,78.97],[20.61,78.98]])
  );
  await tx1.wait();
  console.log("Property submitted!");

  // Validator vote example
  console.log("Voting property...");
  const tx2 = await validator.vote(1, true);
  await tx2.wait();
  console.log("Voted successfully");

  // Register property example
  console.log("Registering property...");
  const tx3 = await registry.registerProperty(1);
  await tx3.wait();
  console.log("Property registered and NFT + FractionToken minted!");

  // Place marketplace order example
  console.log("Placing marketplace order...");
  const fractionTokenAddress = (await registry.properties(1)).fractionToken;
  const FractionToken = await hre.ethers.getContractFactory("FractionToken");
  const fractionToken = FractionToken.attach(fractionTokenAddress);
  const approveTx = await fractionToken.approve(marketplaceAddress, 100);
  await approveTx.wait();
  const placeOrderTx = await marketplace.placeOrder(fractionTokenAddress, 50, hre.ethers.parseEther("0.01"));
  await placeOrderTx.wait();
  console.log("Order placed successfully!");
}

main().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
