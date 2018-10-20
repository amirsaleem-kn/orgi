const crypto = require('crypto');
const server_key = require('../keys/server_key');
const algorithm = 'aes-256-ctr';

class Crypto {
    static encrypt (str) {
        var cipher = crypto.createCipher(algorithm, server_key);
        var crypted = cipher.update(str,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    } 

    static decrypt (str) {
        var decipher = crypto.createDecipher(algorithm, server_key)
        var dec = decipher.update(str,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }
    static createSalt () {
        return crypto.randomBytes(16).toString('hex');
    }
    static createHash (str, salt) {
        return crypto.pbkdf2Sync(str, salt, 10000, 512, 'sha512').toString('hex');
    }
    static validateHash (str, salt, hashValue) {
        const hash = this.createHash(str, salt);
        return hash == hashValue;
    }
    static generateToken (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
}

module.exports = Crypto;