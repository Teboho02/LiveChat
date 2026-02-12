
import Authentication from "./authentication/auth.js"
const form = document.querySelector('form');
const createAccountBtn = document.getElementById('createAccountBtn');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log("Login attempt:", { email, password });

    const authennticate = Authentication.login(email, password);

  if (authennticate.status === 'success') {


        window.sessionStorage.setItem('currentUser', JSON.stringify(authennticate));

        console.log("Login successful:", authennticate);

        window.location.href = './main.html'
    }else{
        console.log("Login failed:", authennticate);
    }
    
});


createAccountBtn.addEventListener('click', function() {
    console.log("Redirecting to create account page");

    window.location.href = "sign-up.html";
});

console.log("Login script loaded");