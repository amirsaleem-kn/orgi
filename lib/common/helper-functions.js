const { Logger, Debugger } = require('../../etc/logs/logger');

function base64_encode (str) {
    Debugger.log(str);
    return new Buffer(JSON.stringify(str)).toString('base64');
}

function base64_decode (str) {
    return Buffer.from(str, 'base64').toString();
}

module.exports = {
    base64_decode: base64_decode,
    base64_encode: base64_encode
}

