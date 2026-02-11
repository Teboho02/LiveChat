import Authentication from "./authentication/auth.js"


const form = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    

    Authentication.createAccount(name, email, password).then(newUser => {
        console.log("Account created successfully:", newUser);
    }).catch(error => {
        console.error("Error creating account:", error);
    });

    

});



