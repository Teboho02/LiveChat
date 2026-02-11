


class Encryption {

    /*

        Uses Ceasar cipher
        Shifts eacher letter by the sum of ascii values of the characters in the email, then mod 32 

    */
    static encrypt(string , email) {

        let encrypted = "";
        let sum = 0;
        for (let i = 0; i < email.length; i++) {
            sum += email.charCodeAt(i);
        }
        let shift = sum % 32;
        for (let i = 0; i < string.length; i++) {
            let charCode = string.charCodeAt(i);
            encrypted += String.fromCharCode((charCode + shift) );
        }
        return encrypted;
    }

        static decrypt(string , email) {

        let decrypted = "";
        let sum = 0;

        for (let i = 0; i < email.length; i++) {
            sum += email.charCodeAt(i);
        }   

        let shift = sum % 32;

        for (let i = 0; i < string.length; i++) {
            let charCode = string.charCodeAt(i);
            decrypted += String.fromCharCode((charCode - shift ));
        }
        return decrypted;
    }
 


}


export default Encryption;

