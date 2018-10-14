const { Logger, Debugger } = require('../../etc/logs/logger');

function base64_encode (str) {
    if(!str){
        return null;
    }
    if(typeof str == 'object' && !Array.isArray(str)) {
        str = JSON.stringify(str);
    } else if (typeof str != 'String') {
        str = str.toString();
    }
    return new Buffer(JSON.stringify(str)).toString('base64');
}

function base64_decode (str) {
    return Buffer.from(str, 'base64').toString();
}

module.exports = {
    base64_decode: base64_decode,
    base64_encode: base64_encode
}

