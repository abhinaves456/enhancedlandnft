
const hre = require("hardhat");
async function main() {
  const [deployer, validator1, validator2, validator3] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Validator = await hre.ethers.getContractFactory("ValidatorConsensus");
  const validators = [validator1.address, validator2.address, validator3.address];
  const validatorContract = await Validator.deploy(validators, 51);
  await validatorContract.deployed();
  console.log("ValidatorConsensus deployed:", validatorContract.address);

  const NFTMapping = await hre.ethers.getContractFactory("NFTMapping");
  const nftMapping = await NFTMapping.deploy();
  await nftMapping.deployed();
  console.log("NFTMapping deployed:", nftMapping.address);

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy(validatorContract.address, nftMapping.address);
  await propertyRegistry.deployed();
  console.log("PropertyRegistry deployed:", propertyRegistry.address);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed:", marketplace.address);
}
main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
