document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const yourwalletAddress = document.getElementById('yourwalletAddress');
    const GovwalletAddress = document.getElementById('GovwalletAddress');
    const contractAddressInput = document.getElementById('contractAddressInput');
    const auditoremail = document.getElementById('auditoremail');
    const submitButton = document.getElementById('submitContractAddress');

    // Initialize contractAddress with an empty string
    let contractAddress = '';
    let contract; // Declare the contract variable
    let walletaddress = '';
    let governwalletaddress = '';

    // Show the modal and overlay on page load
    modal.style.display = 'block';
    overlay.style.display = 'block';

    submitButton.addEventListener('click', () => {
        const userwalletAddress = yourwalletAddress.value;
        const govwalletAddress = GovwalletAddress.value;
        const contractAddress = contractAddressInput.value; // smart contract address
        const auditorEmail = auditoremail.value;

        // Check if the contract address is filled
        if (userwalletAddress.trim() !== '' && contractAddress.trim() !== '' && auditorEmail.trim() !== '' && govwalletAddress.trim() !== '') {
            // Set the contract address and then call fetchProjectDetails
            setContractAddressAndFetchDetails(contractAddress);
            walletaddress = userwalletAddress;
            governwalletaddress = govwalletAddress;

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

    // Function to set the contract address and then fetch project details
    async function setContractAddressAndFetchDetails(address) {
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

        // Now that the contract address is set, call fetchProjectDetails
        fetchProjectDetails();
    }

    // Function to fetch project details and populate the table
    async function fetchProjectDetails() {
        // Replace this with the address of the government's project, not each time
        const projectAddress = governwalletaddress;

        try {
            const result = await contract.methods.projects(projectAddress).call();
            const projectDetails = result;

            const table = document.getElementById('projectInfoTable');

            // Clear the table before populating it
            table.innerHTML = '';

            // Flag to indicate when to start populating the table
            let shouldStartPopulating = false;

            // Keys to exclude
            const excludedKeys = ['status'];

            // Create rows and populate the table with project details, starting from "contractorName"
            for (const [key, value] of Object.entries(projectDetails)) {
                if (key === 'contractorName') {
                    shouldStartPopulating = true;
                }
                if (shouldStartPopulating && !excludedKeys.includes(key) && value !== '' && value !== null && value !== undefined) {
                    const row = `<tr><th>${key}</th><td>${value}</td></tr>`;
                    table.innerHTML += row;
                }
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    }

    // Call the function to populate government-filled project details
    fetchProjectDetails();

    const firebaseConfig = {
        apiKey: "AIzaSyBDNZsdGypeIIl-MQ7gKWtTVroGvY5bpgU",
        authDomain: "newtest-8b05d.firebaseapp.com",
        databaseURL: "https://newtest-8b05d-default-rtdb.firebaseio.com",
        projectId: "newtest-8b05d",
        storageBucket: "newtest-8b05d.appspot.com",
        messagingSenderId: "475517994134",
        appId: "1:475517994134:web:5cec185edebb5e1ff9eeb7"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);

    // Event listener for the contractor form submission
    document.getElementById('contractorForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const projectPlan = document.getElementById('projectPlan').value;
        const expenseBreakdown = document.getElementById('expenseBreakdown').value;
        const documentation = document.getElementById('documentation').files;

        try {
            // Initialize storageRef within the event listener scope
            const storageRef = firebase.storage().ref();

            // Upload files to Firebase Storage
            const documentLinks = [];
            for (let i = 0; i < documentation.length; i++) {
                const file = documentation[i];
                const fileRef = storageRef.child(file.name);

                // Upload the file to Firebase Storage
                await fileRef.put(file);

                // Get the download URL
                const downloadURL = await fileRef.getDownloadURL();
                documentLinks.push({ name: file.name, link: downloadURL }); // Store name and link in an object
            }

            // Call the smart contract function to store contractor details
            await contract.methods.storeContractorDetails(
                projectPlan,
                expenseBreakdown,
                documentLinks
            ).send({ from: walletaddress }); // Replace with the contractor's Ethereum address

            alert('Contractor details submitted and sent to the auditor.');
        } catch (error) {
            console.error('Error submitting contractor details:', error);
        }
    });
});









































































































