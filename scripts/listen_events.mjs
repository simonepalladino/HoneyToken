import { ethers } from "ethers";

// USA WEBSOCKET
const provider = new ethers.WebSocketProvider("ws://127.0.0.1:8545");

// INCOLLA QUI L’ADDRESS STAMPATO DAL DEPLOY
const honeyAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "event UnauthorizedAccess(address attacker, uint256 amount, string action, uint256 timestamp)",
  "event SuspiciousTransfer(address from, address to, uint256 amount, uint256 timestamp)",
];

const honey = new ethers.Contract(honeyAddress, abi, provider);

console.log(" Listener attivo su:", honeyAddress);

// DEBUG: conferma che arrivano blocchi
provider.on("block", (n) => {
  console.log(" Nuovo blocco:", n);
});

// EVENTO PRINCIPALE
honey.on("UnauthorizedAccess", (attacker, amount, action, timestamp) => {
  console.log(
    `   Unauthorized access from ${attacker}\n` +
    `   amount: ${ethers.formatEther(amount)}\n` +
    `   action: ${action}\n` +
    `   timestamp: ${timestamp}`
  );
});

// TRANSFER SOSPETTO
honey.on("SuspiciousTransfer", (from, to, amount) => {
  console.log(
    `   Suspicious transfer\n` +
    `   from: ${from}\n` +
    `   to: ${to}\n` +
    `   amount: ${ethers.formatEther(amount)}`
  );
});
