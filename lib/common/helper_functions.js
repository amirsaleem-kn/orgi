/**
 * @description this file contains commonly used helper functions
 * test cases can be found athelper_functions.spec.js in test directory
 */

const { Logger, Debugger } = require('../../etc/logs/logger');

/**
 * @author Amir Saleem
 * @description method to encode a string to base64
 * @param { type: string } str
 */

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

/**
 * @author Amir Saleem
 * @description method to decode base64 string
 * @param { type: base64 } str
 */

function base64_decode (str) {
    return Buffer.from(str, 'base64').toString();
}

/**
 * @author Amir Saleem
 * @description method to convert string to float
 * @param {type: any} num 
 */

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

