document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const yourwalletAddress = document.getElementById('yourwalletAddress');
    const contractAddressInput = document.getElementById('contractAddressInput');
    const contractoremail = document.getElementById('contractoremail');
    const auditoremail = document.getElementById('auditoremail');
    const submitButton = document.getElementById('submitContractAddress');

    // Initialize contractAddress with an empty string
    let contractAddress = ''; // This variable will store the contract address
    let walletaddress = '';

    // Show the modal and overlay on page load
    modal.style.display = 'block';
    overlay.style.display = 'block';

    submitButton.addEventListener('click', () => {
        const userwalletAddress = yourwalletAddress.value;
        const userContractAddress = contractAddressInput.value;
        const contractorEmail = contractoremail.value;
        const auditorEmail = auditoremail.value;

        // Check if all required inputs are filled
        if (
            userwalletAddress.trim() !== '' &&
            userContractAddress.trim() !== '' &&
            contractorEmail.trim() !== '' &&
            auditorEmail.trim() !== ''
        ) {
            // Update the contractAddress variable with the user's input
            contractAddress = userContractAddress;
            walletaddress = userwalletAddress;

            // You can now use the contractAddress variable for loading the smart contract using fetch
            loadSmartContract(contractAddress);

            // Close the modal and overlay
            modal.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            // Display an error message or alert to inform the user to fill all required inputs.
            // You can customize this part based on your UI design.
            alert('Please fill all required fields before submitting.');
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

    let contract; // Declare the contract variable at a higher scope

    // Function to load the smart contract using fetch
    async function loadSmartContract(address) {
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

        contract = new web3.eth.Contract(contractABI, address); // Assign contract in this function
        // Now you can use the 'contract' object for further interactions with the smart contract.
    }

    // Add an event listener to the form submission
    const projectForm = document.getElementById('projectForm');
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const contractorName = document.getElementById('contractorName').value;
        const contractorEmail = document.getElementById('contractorEmail').value;
        const projectName = document.getElementById('projectName').value;
        const projectDescription = document.getElementById('projectDescription').value;
        const projectLocation = document.getElementById('projectLocation').value;
        const totalDuration = parseInt(document.getElementById('totalDuration').value);
        const totalBudget = parseInt(document.getElementById('totalBudget').value);
        const additionalInfo = document.getElementById('additionalInfo').value;

        try {
            // Store project information in the smart contract
            const accounts = await web3.eth.getAccounts();
            // const governmentAddress = '0x0638dB0898Ac52ff929E387da01b4136482FD4A9'; // The government official's Ethereum address

            // Use the 'contract' variable defined in the loadSmartContract function
            await contract.methods.storeProjectInfo(
                contractorName,
                contractorEmail,
                projectName,
                projectDescription,
                projectLocation,
                totalDuration,
                totalBudget,
                additionalInfo
            ).send({ from: walletaddress });

            alert('Details submitted and sent to the Contractor.');
        } catch (error) {
            console.error('Error submitting project information:', error);
            alert('Error submitting project information. Please check the console for details.');
        }
    });
});


















