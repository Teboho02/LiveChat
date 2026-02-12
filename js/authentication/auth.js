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

        for (let userObj of users) {
            userObj = JSON.parse(userObj);

            if (userObj.email === email && Encryption.decrypt(userObj.password, email) === password) {

                userObj.status = 'online';

                

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