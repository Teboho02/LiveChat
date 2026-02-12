import Encryption from "../utils/encryption.js";
import User from './user.js';

export default class Authentication {
    constructor() {
    }

static login(email, password) {
    const users = JSON.parse(window.localStorage.getItem("Users"));

    if (!users) {
        throw new Error("No users found in localStorage");
    }

    for (let userId in users) {
        const userObj = users[userId];

        if (userObj.email === email && Encryption.decrypt(userObj.password, email) === password) {
            
            // Update online status
            userObj.OnlineStatus = 'online';
            
            // Save the updated user back to localStorage
            users[userId] = userObj;
            localStorage.setItem("Users", JSON.stringify(users));

            return { status: 'success', ...userObj };
        }
    }

    return { status: 'error', message: "Invalid email or password" };
}
    static createAccount(name, email, password) {
        const newUser = new User(name, email, password);
        newUser.save();
        return { ...newUser, status: 'success' };
    }
}