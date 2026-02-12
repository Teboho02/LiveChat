
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
        this.profilePicture = "../assets/download.jpg";
        this.privateMessages = []; 
        this.groupMessages = []; 


        this.subscriptions = [];

        this.subscriptionsGroups = [];


    }


    addUser(User){
        this.subscriptions.push(User);
        User.subscriptions.push(this);

        
        const users = window.localStorage.getItem("Users");



        let newUsers = [];  

        for(let x = 0; x < users.length; x++){
            const userObj = JSON.parse(users[x]);

            

            if(userObj.email === User.email){
                userObj.subscriptions.push(this.email);
                break;
            }

            if(userObj.email === this.email){
                userObj.subscriptions.push(User.email);
                break;
            }
        }


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

save() {
    let User = {
        name: this.name,
        email: this.email,
        password: this.#password,
        userId: this.#userId,
        profilePicture: "../assets/download.jpg",
        subscriptions: this.subscriptions,
        subscriptionsGroups: this.subscriptionsGroups,
    };

    // Get existing users object (not array)
    const existingUsers = JSON.parse(localStorage.getItem("Users")) || {};
    
    // Add/update user with userId as key
    existingUsers[this.#userId] = User;
    
    // Save back to localStorage
    localStorage.setItem("Users", JSON.stringify(existingUsers));
}


}
