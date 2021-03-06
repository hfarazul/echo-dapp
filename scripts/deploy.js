// This is a script for deploying your contracts. You can adapt it to deploy

const { artifacts } = require("hardhat");

// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ECO = await ethers.getContractFactory("ECO");
  const ecoContract = await ECO.deploy();
  await ecoContract.deployed();

  console.log("ECO deployed address:", ecoContract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(ecoContract);
}

function saveFrontendFiles(ecoContract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ECOContract: ecoContract.address }, undefined, 2)
  );

  const ECOContractArtifact = artifacts.readArtifactSync("ECO");
  const CompanyERCArtifact = artifacts.readArtifactSync("CompanyERC");
  const VestingManagerArtifact = artifacts.readArtifactSync("VestingManager");
  const IERC20 = artifacts.readArtifactSync("IERC20");  

  fs.writeFileSync(
    contractsDir + "/ECOContract.json",
    JSON.stringify(ECOContractArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/CompanyERC.json",
    JSON.stringify(CompanyERCArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/VestingManager.json",
    JSON.stringify(VestingManagerArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/IERC20.json",
    JSON.stringify(IERC20, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
