const helper_functions = require('../lib/common/helper_functions');
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
        respons_object.status = 'ok'
        res.json(respons_object);
    }
    static fail (res, errors) {
        respons_object.errors = errors;
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
    static forbidden (res) {
        respons_object.errors = [
            {
                err_code: 403,
                err_message: 'You are not allowed to use this application'
            }
        ];
        respons_object.status = 'fail';
        res.status(403).json({
            respons_object
        });
    }
    static missingParameters (res, requiredParameters) {
        respons_object.errors = [
            {
                err_code: 422,
                err_message: 'missing required parameters',
                required_parameters: requiredParameters
            }
        ];
        respons_object.status = 'fail';
        res.status(422).json({
            respons_object
        });
    }
}

module.exports = Response;