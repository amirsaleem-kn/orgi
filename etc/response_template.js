const helper_functions = require('../lib/common/helper-functions');
const { base64_decode, base64_encode } = helper_functions;

var api_status = {
    status: "stable",
    health: "OK",
    version: "1.1.0"
}
var respons_object = {
    api: api_status,
    help: 'https://orgi.com/help'
}

class Response {
    static success (res, body) {
        respons_object.body = base64_encode(body);
        respons_object.status = 'success'
        res.json(respons_object);
    }
    static fail (res, errorCode, errorMessage) {
        respons_object.errors = [ { errorCode, errorMessage } ];
        respons_object.body = body;
        respons_object.status = 'fail';
        res.json(respons_object);
    }
    static notAuthorized (res) {
        respons_object.errors = [
            {
                err_code: 401,
                err_message: 'You are unauthorised to use this application'
            }
        ];
        respons_object.status = 'fail';
        res.status(401).json({
            respons_object
        });
    }
}

module.exports = Response;