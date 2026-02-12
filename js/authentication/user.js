
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
        this.profilePicture = "../assets/download.jpg";


        //Messages from private chats will be sent here

        this.subscriptions = [];

        //Messages from group chats will be sent here
        this.subscriptionsGroups = [];


    }

    //going to maintain a list of users and groups that the user is subscribed to, and update the chat interface accordingly when new messages arrive.

    addUser(User){
        this.subscriptions.push(User);
        User.subscriptions.push(this);
    }

    addGroup(group){
        this.subscriptionsGroups.push(group);
        group.members.push(this);

    }

    listenForMessages(){
        //This method will listen for incoming messages and update the chat interface accordingly


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
