import Encryption from "../utils/encryption.js";
import User from './user.js';
export default class Authentication
 {

    constructor(){
    }



     login(email, password) {



        //validate the information against the localStorage

        window.localStorage.setItem("lastname", "Smith");
        console.log("Testing localStorage access:", window.localStorage.getItem("lastname"));


        const users = JSON.parse(window.localStorage.getItem("Users"));


        if (!users) {
            throw new Error("No users found in localStorage");
        }


        users.forEach(userObj => {
            userObj = JSON.parse(userObj);
            if(userObj.email === email && userObj.password === Encryption.decrypt(password, email)) {
                return {'status':'success', ...userObj};
            }
        });


        return "Invalid email or password";

    }


     createAccount(name, email, password) {

        const newUser = new User(name, email, password);
        newUser.save();
        return newUser;

    }

    test(){
            window.localStorage.setItem("lastname", "Smith");

    }

}



