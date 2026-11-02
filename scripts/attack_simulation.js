const { ethers } = require("hardhat");

async function main() {
  const [owner, user, attacker] = await ethers.getSigners();

  // DEVE ESSERE LO STESSO ADDRESS USATO NEL LISTENER
  const HONEY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const honey = await ethers.getContractAt(
    "HoneyToken",
    HONEY_ADDRESS
  );

  console.log(" Starting attack simulation...");

  // Owner (whitelistato) manda token all’attacker
  await honey.transfer(
    attacker.address,
    ethers.parseEther("5")
  );

  console.log(" Tokens sent to attacker");

  // Attacker prova a trasferire → honeypot
  await honey.connect(attacker).transfer(
    user.address,
    ethers.parseEther("1")
  );

  console.log(" Attack executed");

  // Stato on-chain
  const flagged = await honey.flaggedAsAttacker(attacker.address);
  const locked = await honey.lockedFunds(attacker.address);

  console.log("Attacker flagged?", flagged);
  console.log("Locked funds:", ethers.formatEther(locked));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
