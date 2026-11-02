// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HoneyToken is ERC20 {
    mapping(address => bool) public whitelist; // Utenti autorizzati a trasferire
    mapping(address => bool) public flaggedAsAttacker; // Utenti che hanno tentato trasferimenti non autorizzati
    mapping(address => uint256) public lockedFunds; // Registro dei fondi virtualmente bloccati

/* Eventi per il monitoraggio delle attività del contratto */
    event UnauthorizedAccess(
        address attacker,
        uint256 amount,
        string action,
        uint256 timestamp
    );

    event SuspiciousTransfer(
        address from,
        address to,
        uint256 amount,
        uint256 timestamp
    );

    event AddressFlagged(
        address attacker,
        uint256 timestamp
    );

    event FundsLocked(
        address attacker,
        uint256 amount,
        uint256 timestamp
    );

    constructor() ERC20("HoneyToken", "HONEY") {
    	// Manda 1000 token all'indirizzo che distribuisce il contratto (deployer)
        _mint(msg.sender, 1000 * 1e18);
        // Aggiunge il creatore alla whitelist per permettergli di scambiare i token
        whitelist[msg.sender] = true;
    }

	
    function setWhitelist(address user, bool status) external {
        whitelist[user] = status;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
    	// SE l'utente che invia NON è nella whitelist...
        if (!whitelist[msg.sender]) {
            // Segna l'utente come attaccante in modo permanente
            flaggedAsAttacker[msg.sender] = true;
            // Registra l'importo che l'utente ha provato a spostare
            lockedFunds[msg.sender] += amount;


	/* Emette log di sicurezza (spesso usati per tracciare i bot nei test) */
            emit UnauthorizedAccess(
                msg.sender,
                amount,
                "transfer",
                block.timestamp
            );

            emit AddressFlagged(
                msg.sender,
                block.timestamp
            );

            emit FundsLocked(
                msg.sender,
                amount,
                block.timestamp
            );

            return false;
        }
       // SE l'utente è in whitelist, il trasferimento procede
        emit SuspiciousTransfer(
            msg.sender,
            to,
            amount,
            block.timestamp
        );

        return super.transfer(to, amount);
    }
}
