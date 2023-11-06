document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const yourwalletAddress = document.getElementById('yourwalletAddress');
    const GovwalletAddress = document.getElementById('GovwalletAddress');
    const ContwalletAddress = document.getElementById('ContwalletAddress');
    const contractAddressInput = document.getElementById('contractAddressInput');
    const submitButton = document.getElementById('submitContractAddress');

    // Initialize contractAddress with an empty string
    let contractAddress = '';
    let contract; // Declare the contract variable
    let walletaddress = '';
    let governwalletaddress = '';
    let contractorwallet = '';

    // Show the modal and overlay on page load
    modal.style.display = 'block';
    overlay.style.display = 'block';

    submitButton.addEventListener('click', () => {
        const userwalletAddress = yourwalletAddress.value;
        const govwalletAddress = GovwalletAddress.value;
        const contwalletAddress = ContwalletAddress.value;
        const contractAddress = contractAddressInput.value;

        // Check if the contract address is filled
        if (userwalletAddress.trim() !== '' && contractAddress.trim() !== '' && govwalletAddress.trim() !== '' && contwalletAddress.trim() !== '') {
            // Set the contract address and then call displayGovernmentAndContractorInfo
            setContractAddressAndDisplayInfo(contractAddress);
            walletaddress = userwalletAddress;
            governwalletaddress = govwalletAddress;
            contractorwallet = contwalletAddress;

            // Close the modal and overlay
            modal.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            // Display an error message or alert to inform the user to fill the contract address.
            // You can customize this part based on your UI design.
            alert('Please fill the contract address before submitting.');
        }
    });

    // Check if MetaMask is installed and available
    if (typeof window.ethereum !== 'undefined') {
        // Initialize web3.js with MetaMask's provider
        window.web3 = new Web3(ethereum);

        // Request permission to access the user's MetaMask account
        ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                const userAddress = accounts[0];
                console.log('Connected to MetaMask. User address: ' + userAddress);
            })
            .catch(error => {
                console.error('User denied account access or an error occurred:', error);
            });
    } else {
        console.log('No Web3 provider detected. You should consider using MetaMask or another Web3 provider.');
    }

    // Function to set the contract address and then display government and contractor information
    async function setContractAddressAndDisplayInfo(address) {
        // Load your smart contract using fetch
        const abiUrl = 'contractABI.json'; // Replace with the URL or relative path to your ABI file

        let contractABI;
        try {
            const response = await fetch(abiUrl);
            if (!response.ok) {
                throw new Error('Failed to load contract ABI');
            }
            contractABI = await response.json();
        } catch (error) {
            console.error('Error loading contract ABI:', error);
            return;
        }

        contract = new web3.eth.Contract(contractABI, address);

        // Now that the contract address is set, call functions to display information
        displayGovernmentAndContractorInfo();
        displayContractorInfo(); // Add this line to display contractor information
    }

    // Function to retrieve government information
    function displayGovernmentAndContractorInfo() {
        // Replace this with the government's Ethereum address (where the government project is stored)
        // const governmentAddress = '0x0638dB0898Ac52ff929E387da01b4136482FD4A9';

        // Fetch government project details
        contract.methods.projects(governwalletaddress).call()
            .then(result => {
                // Populate the Government Information table with government data
                document.getElementById('governmentInfo').innerHTML = `
                    <tr>
                        <th>Contractor Name</th>
                        <td>${result.contractorName}</td>
                    </tr>
                    <tr>
                        <th>Contractor Email</th>
                        <td>${result.contractorEmail}</td>
                    </tr>
                    <tr>
                        <th>project Name</th>
                        <td>${result.projectName}</td>
                    </tr>
                    <tr>
                        <th>project Description</th>
                        <td>${result.projectDescription}</td>
                    </tr>
                    <tr>
                        <th>project Location</th>
                        <td>${result.projectLocation}</td>
                    </tr>
                    <tr>
                        <th>total Duration</th>
                        <td>${result.totalDuration}</td>
                    </tr>
                    <tr>
                        <th>total Budget</th>
                        <td>${result.totalBudget}</td>
                    </tr>
                    <tr>
                        <th>additional Info</th>
                        <td>${result.additionalInfo}</td>
                    </tr>
                `;
            })
            .catch(error => {
                console.error('Error fetching government project details:', error);
            });
    }

    // Function to retrieve contractor information
    function displayContractorInfo() {
        // Replace this with the contractor's Ethereum address
        // const contractorAddress = '0x0638dB0898Ac52ff929E387da01b4136482FD4A9';

        // Fetch contractor project details
        contract.methods.projects(contractorwallet).call()
            .then(result => {
                // Populate the Contractor Information table with contractor data
                const contractorTable = document.getElementById('contractorInfo');
                contractorTable.innerHTML = `
                    <tr>
                        <th>Project Plan</th>
                        <td>${result.projectPlan}</td>
                    </tr>
                    <tr>
                        <th>Expense Breakdown</th>
                        <td>${result.expenseBreakdown}</td>
                    </tr>
                `;

                // Check if documents array exists and is an array
                if (Array.isArray(result.documents) && result.documents.length > 0) {
                    const documentLinks = result.documents;
                    for (let i = 0; i < documentLinks.length; i++) {
                        const documentRow = document.createElement('tr');
                        documentRow.innerHTML = `
                            <th>Document Link ${i + 1}</th>
                            <td>${documentLinks[i]}</td>
                        `;
                        contractorTable.appendChild(documentRow);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching contractor project details:', error);
            });
    }



    // Auditor Verification Form
    document.getElementById('auditForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const auditRemarks = document.getElementById('auditRemarks').value;

        // Determine if the auditor approves or rejects the project
        const action = event.submitter.name;

        try {
            // Replace this with the address of the project you want to audit
            const projectAddress = '0x0638dB0898Ac52ff929E387da01b4136482FD4A9';

            if (action === 'approve') {
                // Call the smart contract function to approve the project
                await contract.methods.submitAuditReport(auditRemarks).send({ from: walletaddress });
            } else if (action === 'reject') {
                // Call the smart contract function to reject the project
                await contract.methods.rejectProject(auditRemarks).send({ from: walletaddress });
            }

            alert('Audit report submitted.');
        } catch (error) {
            console.error('Error submitting audit report:', error);
        }
    });


});















