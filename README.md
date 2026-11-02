# HoneyToken on Hardhat: Blockchain Security & Honeypot Detection

## 📌 Overview
This project presents a proactive blockchain security framework implementing an **ERC-20 HoneyToken** on a local Hardhat environment. By leveraging active threat detection and honeypot techniques, the system traps unauthorized actors, locks compromised funds, and streams real-time security events to an off-chain monitoring service for forensic analysis.

---

## 🚨 Problem & Solution
* **The Problem:** Traditional smart contract security relies heavily on transaction reverts (`require`/`revert`), which cancel state updates and leave behind limited on-chain trace data for investigating cyberattacks or tracking persistent threats.
* **The Solution:** A honeypot mechanism where unauthorized transfer attempts do not revert. Instead, the contract flags the caller as an attacker, traps their balance in a locked state, and emits detailed security events for real-time alerting and forensic investigation.

---

## 🏗️ System Architecture
The framework is divided into two main layers:

1. **On-Chain Layer (Solidity / Hardhat Network):**
   * **`HoneyToken.sol`:** An ERC-20 token contract built using OpenZeppelin standards.
   * **Whitelist Mechanism:** Restricts standard transfers to approved addresses.
   * **Attacker Flagging & Fund Lock:** Non-whitelisted senders trigger `flaggedAsAttacker = true` and have their token balances moved to a `lockedFunds` mapping.
   * **Security Events:** Emits `UnauthorizedAccess` and `AddressFlagged` events containing transaction details, timestamp, and addresses.

2. **Off-Chain Layer (Node.js & Ethers.js):**
   * **`listen_events.mjs`:** A real-time monitoring service connecting via WebSocket.
   * Intercepts on-chain security events instantly to trigger external alerts and threat logging.

---

## 🔄 Attack Simulation & Workflow
1. **Transfer Execution:** An attacker invokes `transfer(target, amount)`.
2. **Whitelist Check:** The contract evaluates whether `msg.sender` is whitelisted.
3. **Honeypot Trigger (If Not Whitelisted):**
   * The address is marked as an attacker (`flaggedAsAttacker = true`).
   * Balance is moved to `lockedFunds`.
   * On-chain security events are emitted (`UnauthorizedAccess`).
   * Returns `false` (0 moved) without reverting the transaction, preserving the audit trail.
4. **Off-Chain Alerting:** The Node.js WebSocket listener detects the emitted event and raises an automated security alert.

---

## 📊 Use Cases & Security Analysis
* **Proactive DeFi Defense:** Traps malicious actors before they can exploit decentralized finance protocols.
* **Persistent Forensic Audit Trail:** Maintaining execution state allows security teams to log attacker behaviors and timing.
* **Alerting Integration:** Easily connects with Web3 security dashboards, webhooks, and incident management pipelines.

---

## 🛡️ Risk Analysis & Design Trade-offs
* **Non-Reverting Transactions:** Allows audit logging, but client dApps must handle `false` return values to prevent state inconsistencies.
* **Spoofing & Replay Mitigation:** Address-based flags require complementary rate-limiting and off-chain validation.
* **Whitelist Governance:** Requires secure admin controls to avoid misconfigurations and false positives.

---

## 🛠️ Tech Stack & Dependencies
* **Smart Contracts:** Solidity, OpenZeppelin ERC-20
* **Development Environment:** Hardhat 2.x
* **Client Library:** Ethers.js (WebSocket Provider)
* **Runtime:** Node.js
