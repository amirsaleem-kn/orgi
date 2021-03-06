/**
 * @author Amir Saleem
 * @description this file contains the logic for sending Response to the client
 */

// an object containing API health check

var api_status = {
    status: "stable",
    health: "OK",
    version: "1.1.0",
    worker: process.pid,
    runtime: `NodeJS ${process.versions.node}`,
    arch: process.arch,
    platform: process.platform
}

/**
 * @author Amir Saleem
 * @description Response class used to send response messages to the clients
 * @method success method to send successful response to the client with status code 200
 * @method fail method to send fail response with status code 200
 * @method notAuthorized method to send response with status code 401
 * @method forbidden method to send response with status code 403
 * @method missingParameters method to send response with status code 422
 */

class Response {

    static getResponseObject () {
        return {
            api: api_status,
            help: 'https://orgi.com/help'
        }
    }

    static success (res, body) {
        var respons_object = this.getResponseObject();
        respons_object.body = body;
        respons_object.status = 'ok'
        res.json(respons_object);
    }

    static fail (res, errors) {
        var respons_object = this.getResponseObject();
        respons_object.errors = errors;
        respons_object.status = 'fail';
        res.json(respons_object);
    }

    static serviceError (res) {
        var respons_object = this.getResponseObject();
        respons_object.errors = [{
            err_code: 503,
            err_message: 'Internal Error'
        }];
        respons_object.status = 'fail';
        res.status(503).json(respons_object)
    }

    static notAuthorized (res) {
        var respons_object = this.getResponseObject();
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
        var respons_object = this.getResponseObject();
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
        var respons_object = this.getResponseObject();
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

// make the class accessible to rest of the code

module.exports = Response;