export class Encryption {
    static encrypt(data, secretKey) {
        var CryptoJS = require('../crypto-js');
        var AES = require('../crypto-js/aes');

        let result = CryptoJS.AES.encrypt(data, secretKey).toString();

        return result;
     }

    static decrypt(encryptedData, secretKey) {
        var CryptoJS = require('../crypto-js');
        var AES = require('../crypto-js/aes');

        var bytes  = CryptoJS.AES.decrypt(encryptedData.toString(), secretKey);
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        return decryptedData;
     }

     static encryptObj(obj, secretKey) {
        const newEncryptObj = {};

        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
           
            if(key === 'id' || key === 'idNote'){
            
                newEncryptObj[key] = obj[key];
            } else {
               
                newEncryptObj[key] = this.encrypt(obj[key], secretKey);
            }
        }
      
        return newEncryptObj;
     }

     static decryptObj(obj, secretKey) {
        const newDecryptObj = {};

        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
           
            if(key === 'id' || key === 'idNote'){
                newDecryptObj[key] = obj[key];
            } else {
                newDecryptObj[key] = this.decrypt(obj[key], secretKey);
            }
           
        }

        return newDecryptObj;
     }


      // static encrypt(text, secretKey){
    //     var CryptoJS = require("crypto-js");
        
    //     // var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'); 
    //     // var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f'); 
    //     // var encrypted = CryptoJS.AES.encrypt("Message", key, { iv: iv });
    //     // var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
    //     // var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    //     // console.log(plaintext);

    //     // console.log(encrypted);
    //     // console.log(decrypted);

    //     var encrypted = CryptoJS.AES.encrypt(text, secretKey); 
    //     var decrypted = CryptoJS.AES.decrypt(encrypted, secretKey);
    //     var plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    //     console.log(decrypted);
    //     return encrypted;

    //     console.log(plaintext);

    //     console.log(encrypted);
    // }
}