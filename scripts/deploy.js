// Importa l'oggetto 'ethers' dal plugin di Hardhat
const { ethers } = require("hardhat");

async function main() {
	// Ottiene la "Contract Factory": è un'astrazione usata per distribuire nuovi smart contract.
	const HoneyToken = await ethers.getContractFactory("HoneyToken");
	// Avvia il processo di deploy
  	const honey = await HoneyToken.deploy();
  	// Aspetta che la transazione venga confermata (minata) in un blocco.
  	await honey.waitForDeployment();
  	// Stampa l'indirizzo dove il contratto è stato appena creato.
  	console.log("Deployed at:", await honey.getAddress());
}

main();
