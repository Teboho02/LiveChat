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
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let newAccount = Authentication.createAccount(name, email, password);

    console.log("New account", newAccount);

    alert("new account created");

    window.location.href = './sign-in.html';


});