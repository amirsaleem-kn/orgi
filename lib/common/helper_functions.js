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

function cast_float (num) {
    if(!num || isNaN(num)) {
        return 0
    }
    if(typeof num == 'string' || typeof num == 'number') {
        try {
            return parseFloat(num);
        } catch (e) {
            Debugger.log(e);
        }
    } else {
        return 0
    }
}

module.exports = {
    base64_decode: base64_decode,
    base64_encode: base64_encode,
    cast_float: cast_float
}

