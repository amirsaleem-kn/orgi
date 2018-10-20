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
}

module.exports = Crypto;