import Encryption from "../utils/encryption.js";

export class ProfileFunctions {
  static updatePassword(newPassword, userId, email) {
    const newPasswordEncrypted = Encryption.encrypt(newPassword, email);

    const users = JSON.parse(localStorage.getItem("Users"));

    if (users && users[userId]) {
      users[userId].password = newPasswordEncrypted;
      localStorage.setItem("Users", JSON.stringify(users));
    }
  }

  static updateProfilePicture(newPictureUrl, userId) {
    const users = JSON.parse(localStorage.getItem("Users"));

    if (users && users[userId]) {
      users[userId].profilePicture = newPictureUrl;
      localStorage.setItem("Users", JSON.stringify(users));
    }
  }

  static updateName(newName, userId) {
    const users = JSON.parse(localStorage.getItem("Users"));

    if (users && users[userId]) {
      users[userId].name = newName;
      localStorage.setItem("Users", JSON.stringify(users));
    }
  }
}
