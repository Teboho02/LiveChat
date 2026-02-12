
import Authentication from "./authentication/auth.js"
const form = document.querySelector('form');
const createAccountBtn = document.getElementById('createAccountBtn');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    

    const authennticate = Authentication.login(email, password);

            window.sessionStorage.setItem('currentUser', JSON.stringify(authennticate));

  if (authennticate.status === 'success') {


        window.sessionStorage.setItem('currentUser', JSON.stringify(authennticate));


        window.location.href = './main.html'
    }else{
        console.log("Login failed:", authennticate);
    }
    
});


createAccountBtn.addEventListener('click', function() {

    window.location.href = "sign-up.html";
});

