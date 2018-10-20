/**
 * @author Amir Saleem
 * @description This file contains the sign-in logic
 */

const db = require('../../core/Database');
const Response = require('../../etc/response_template');
const Crypto = require('../../core/Crypto');
const { base64_decode } = require('../../lib/common/helper_functions');
const { Debugger, Logger } = require('../../etc/logs/logger');

/**
 * @description method to sign-in the user and generate an authentication token
 * @param {type:obj} req an HTTP request object
 * @param {type:res} res an HTTP response object
 */

function signIn(req, res) {
    const credentials = req.get('Authorization') || null;
    // check if credentials are not present
    if(!credentials) {
        Response.forbidden(res); // send 403
        return;
    };
    // split the string on space
    var splittedCreds = credentials.split(' ');
    // if credentials first part is not basic, send 403
    if(splittedCreds[0] != 'Basic'){
        Response.forbidden(res);
        return;
    }
    // get the username and password out from the string
    const base64creds = splittedCreds[1];
    const decodedCreds = base64_decode(base64creds).split(':');
    const username = decodedCreds[0];
    const password = decodedCreds[1];
    
    // get an active mysql connection
    db.getConnection(function(err, connection){
        if(err) {
            Response.serviceError(res);
            return;
        }
        // get user details using username
        getUser(connection, username).then(userData => {
            // if user does not found, send 403
            if(userData.length == 0) {
                Response.forbidden(res);
                return;
            }
            // compare hash of the user's password
            const validUser = Crypto.validateHash(password, userData[0]['salt'], userData[0]['hash']);
            // if hash matches
            if(validUser) {
                // generate a new token
                const token = Crypto.generateToken(req.get('User-Agent'));
                // store token in database
                storeToken(connection, userData[0]['userID'], token).then(data => {
                    connection.release();
                    Response.success(res, {
                        token: token                        
                    });
                }).catch(err => {
                    Debugger.log(err);
                    Response.serviceError(res);
                });
            } else {
                Response.forbidden(res);
                return;
            }
        }).catch(err => {
            Response.serviceError(res);
        });
    });
}

/**
 * @description method to store token in AccessToken table against a userID
 * @param {type:object} connection an active mysql connection
 * @param {type:string} userID id of the user
 * @param {type:hash} token a token hash 
 */

function storeToken (connection, userID, token) {
    return new Promise((resolve, reject) => {
        db.executeQuery({
            query: "INSERT INTO AccessToken(userID, token, expiry) values(?, ?, ?)",
            queryArray: [userID, token, Date.now()],
            connection: connection
        }, function(err, result){
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        });
    });   
}

/**
 * @description method to get user details from username
 * @param {type:object} connection an active mysql connection
 * @param {type:string} username username of the user 
 */

function getUser (connection, username) {
    return new Promise ((resolve, reject) => {
        db.executeQuery({query:"SELECT userID, username, hash, salt from UserMaster where username = ?", queryArray: [username], connection: connection}, function(err, userData){
            if(err) {
                reject(err);
                return;
            }
            resolve(userData);
        });
    });
}

module.exports = signIn;