
import Encryption from "../utils/encryption.js";

export default class User{


    #userId;
    #password;

    constructor(name, email, password){

        if(!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === ""){
            throw new Error("All fields are required");
        }

        this.name = name;
        this.email = email;
        this.#password = Encryption.encrypt(password, email);
        this.#userId = this.generateUniqueId();
        this.status = 'offline';



    }
    generateUniqueId(){
        this.#userId = Date.now().toString(36) + Math.random().toString(36);
        return this.#userId;
    }

    changeToOnline(){
        this.status = 'online';
    }

    save(){
        let User ={
            name: this.name,
            email: this.email,
            password: this.#password,
            userId: this.#userId
        };
        let UserString = JSON.stringify(User);

    
        const existingUsers = JSON.parse(localStorage.getItem("Users")) || [];
        existingUsers.push(UserString);
        localStorage.setItem("Users", JSON.stringify(existingUsers));
    }

}
