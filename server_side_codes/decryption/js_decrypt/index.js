

var CryptoJS = require("crypto-js");

function bufferFile(relPath) {
   return fs.readFileSync(path.join(__dirname, relPath)); // zzzz....
}

var fs = require('fs');
var path = require('path');

// Buffer mydata
var BUFFER = bufferFile('./daily_survey_20170322-013202.txt');
var transitmessage = BUFFER.toString();
var pass = "Z&wz=BGw;%q49/<)";

// Code goes here
var keySize = 256;
var ivSize = 128;
var iterations = 100;

var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
var encrypted = transitmessage.substring(64);

var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize/32,
    iterations: iterations
});

var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
  iv: iv, 
  padding: CryptoJS.pad.Pkcs7,
  mode: CryptoJS.mode.CBC
});

console.log("Decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));





/*

//console.log(BUFFER.toString());

//var transitmessage = "101b7b60501419c9a090ce308b4097709cd3c959cdd2007a178fafe46c80d84ayd6doyMruDMTmlqvqcdICxAUwk+iYEJQ3X6ZTxEEa1ooAuDCjZlrDwEaOx7mp0uYx6zoJtJ1s0rwRqkgtm9X8sfnGmw+l8BKjRl9BTfQFkdBecI7sjSdH1J5BbdhH+noRvJv0E6rjKCKtu5u7H4cQnJjA7Dp8r1ssvelRLZApWJ1ewM31iH3XtIkbYN5KITQx9g+iQUiaE5iVPOMQ+2qey6w8qBql8j/vpisuZOzgYCNXAcxfOY4yMvuXkVcmpMSBlFcdU8Xc3nkMKZ+53+6RATH8XfR1LZbycddIqUUsCJcGGImVBPi6fGnvdqz/akjL/1fnqVEpqN+zSEjRieqlTIOchL6Xi81anFNCDkbssr3FxI8LJijAQVKFHHSC/sDjaFttLY6tP3rZesoayob1kz/zFodVVTrRZkKKO7vH8YqYxRbvcdt5aUIVw3niV1DtaMVqLn1JObEDRxF6JmYFDqOFriwZ6YyI6UHlaOVliyelHOuAD32bk8pmxSaDY7fwNjioMeY3Efwq/D2PIvzZb/KnHQ2fEYn5A5VCnH6aWJaWO8nKz+XxwN7EZ5ucD9z9hMXlaq1lqJQFh9tILEk2gcNn2+6d7MNe17YgvmMGePKM3hOmoxvGSLsdb46Qj0sp+iXtV2YQ9ps3WeNFhWJxNhnwDEYeICI99pzVy+tPp1HgRwvtnVaFu9pcce/Fz3nZiV4kmt2ZYO7z75+moIvedzq6wwYFN++rzYRmU4l31/fERQRxADZdpiW4oqaS/HzEmorW4mm+xs/4dFy7m1Nh318ayPLgrZqKh2oxUu5zhLjoYQMVyYbqkzh+dId2JaS+jb7skdS8b4w3ENgREAp7laYNt5K7Ae8EkHsbQqB06pClE1HqpKf5zKlHPBz1hLh0dZYuBoSQTgsbFaef9v5cki2sGK5d0+1929WjsTwTP8=";//BUFFER.toString();



var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
//console.log(SHA256("Message"));

console.log(CryptoJS.HmacSHA1("Message", "Key"));
console.log('print');
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log(plaintext);
*/







