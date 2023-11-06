// JavaScript for creating audit cards
let auditCount = 0;

function createAuditCard() {
    const auditContainer = document.getElementById("auditContainer");
    auditCount++;

    const card = document.createElement("a");
    card.className = "card";

    // Set the href to the local file path
    card.href = 'http://localhost:8080/government.html'; // Replace with your actual file path

    card.innerHTML = `Audit ${auditCount}`;
    auditContainer.appendChild(card);
}

document.getElementById("createAudit").addEventListener("click", createAuditCard);



