// Initialize Firebase using the firebaseConfig from firebaseConfig.js
firebase.initializeApp(firebaseConfig);

// Function to handle the login process
function login() {
    const loginForm = document.querySelector('#login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm['email'].value;
        const password = loginForm['password'].value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User signed in successfully
                const user = userCredential.user;
                const db = firebase.firestore();

                // Retrieve the user's role from Firestore
                db.collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            const userRole = userData.role;

                            // Redirect based on the user's role
                            redirectToDashboard(userRole);
                        } else {
                            console.error('User document not found.');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                // Handle login errors
                console.error(error);
            });
    });
}

// Function to redirect users to role-specific dashboards
function redirectToDashboard(userRole) {
    switch (userRole) {
        case 'Govt. Body':
            window.location.href = 'http://localhost:8080/dashboard/index.html';
            break;
        case 'Contractor':
            window.location.href = 'http://localhost:8080/dashboard/index0.html';
            break;
        case 'Auditor':
            window.location.href = 'http://localhost:8080/dashboard/index0.html';
            break;
        default:
            console.error('Unknown user role');
    }
}

// Call the login function to set up the login logic
login();
