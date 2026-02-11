
import Authentication from "./authentication/auth.js"
const form = document.querySelector('form');
const createAccountBtn = document.getElementById('createAccountBtn');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log("Login attempt:", { email, password });

    const authennticate = new Authentication();
    authennticate.login(email, password);
    authennticate.test();
    if (authennticate.status === 'success') {
        console.log("Login successful:", authennticate);
    }else{
        console.log("Login failed:", authennticate);
    }
    
});


createAccountBtn.addEventListener('click', function() {
    console.log("Redirecting to create account page");

    window.location.href = "sign-up.html";
});

console.log("Login script loaded");