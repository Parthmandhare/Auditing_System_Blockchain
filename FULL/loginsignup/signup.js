// Initialize Firebase using the firebaseConfig from firebaseConfig.js
firebase.initializeApp(firebaseConfig);

// Function to show/hide role-specific fields based on the selected role
function toggleRoleFields() {
    var roleSelect = document.getElementById("role");
    var govtBodyFields = document.getElementById("govtBodyFields");
    var contractorFields = document.getElementById("contractorFields");
    var auditorFields = document.getElementById("auditorFields");
    var signupForm = document.getElementById("signup-form");

    govtBodyFields.style.display = "none";
    contractorFields.style.display = "none";
    auditorFields.style.display = "none";

    var selectedRole = roleSelect.value;

    // Update the "required" attribute for fields based on visibility
    signupForm.querySelectorAll('input').forEach(function (field) {
        if (field.name === "companyName" || field.name === "gstNumber" || field.name === "employeeID") {
            if (selectedRole === "Govt. Body") {
                field.removeAttribute('required');
            } else {
                field.setAttribute('required', 'required');
            }
        }
    });

    if (selectedRole === "Govt. Body") {
        govtBodyFields.style.display = "block";
    } else if (selectedRole === "Contractor") {
        contractorFields.style.display = "block";
    } else if (selectedRole === "Auditor") {
        auditorFields.style.display = "block";
    }
}



// Attach the function to the onchange event of the role select element
var roleSelect = document.getElementById("role");
roleSelect.addEventListener("change", toggleRoleFields);

// Call the function initially to handle the default state
toggleRoleFields();

// Function to handle the signup process
function signUp() {
    const signupForm = document.querySelector('#signup-form');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = signupForm['email'].value;
        const password = signupForm['password'].value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User signed up successfully
                const user = userCredential.user;
                const db = firebase.firestore();

                // Get the selected role and additional fields based on role
                const selectedRole = signupForm['role'].value;
                const userData = {
                    name: signupForm['name'].value,
                    phone: signupForm['phone'].value,
                    dglocker: signupForm['dglocker'].value,
                    username: signupForm['username'].value,
                };

                if (selectedRole === "Govt. Body") {
                    userData.district = signupForm['district'].value;
                    userData.villageCity = signupForm['villageCity'].value;
                    userData.officeID = signupForm['officeID'].value;
                    userData.govtID = signupForm['govtID'].value;
                } else if (selectedRole === "Contractor") {
                    userData.companyName = signupForm['companyName'].value;
                    userData.gstNumber = signupForm['gstNumber'].value;
                } else if (selectedRole === "Auditor") {
                    userData.employeeID = signupForm['employeeID'].value;
                }

                // Add user data to Firestore
                db.collection('users').doc(user.uid).set(userData)
                    .then(() => {
                        
                        window.location.href = 'http://localhost:8080/loginsignup/login.html';
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                // Handle signup errors
                console.error(error);
            });
    });
}

// Call the signUp function to set up the signup logic
signUp();
