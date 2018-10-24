/**
 * @author Amir Saleem
 * @description this file contains cryptographic logic
 */

const crypto = require('crypto');
const server_key = require('../keys/server_key');
const keys = require('../keys/keys');
const algorithm = keys.crypto_vars.algorithm;

/**
 * @description top level class to use cryptographic functions
 * @static
 */

class Crypto {
    // encrypt a string
    static encrypt (str) {
        var cipher = crypto.createCipher(algorithm, server_key);
        var crypted = cipher.update(str,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    } 

    // decrypt a string
    static decrypt (str) {
        var decipher = crypto.createDecipher(algorithm, server_key)
        var dec = decipher.update(str,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    // create a salt
    static createSalt () {
        return crypto.randomBytes(16).toString('hex');
    }

    // create a hash using string and a salt
    static createHash (str, salt) {
        return crypto.pbkdf2Sync(str, salt, 10000, 512, 'sha512').toString('hex');
    }

    // match the hash values
    static validateHash (str, salt, hashValue) {
        const hash = this.createHash(str, salt);
        return hash == hashValue;
    }

    // generate an md5 token
    static generateToken (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
}

module.exports = Crypto;