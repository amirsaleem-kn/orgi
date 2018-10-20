const db = require('../../core/Database');
const Response = require('../../etc/response_template');
const Crypto = require('../../core/Crypto');
const { base64_decode } = require('../../lib/common/helper_functions');
const { Debugger, Logger } = require('../../etc/logs/logger');

function signIn(req, res) {
    const credentials = req.get('Authorization') || null;
    if(!credentials) {
        Response.forbidden(res);
        return;
    };
    Debugger.log('here');
    var splittedCreds = credentials.split(' ');
    if(splittedCreds[0] != 'Basic'){
        Response.forbidden(res);
        return;
    }
    const base64creds = splittedCreds[1];
    const decodedCreds = base64_decode(base64creds).split(':');
    const username = decodedCreds[0];
    const password = decodedCreds[1];
    // check if user exists
    db.getConnection(function(err, connection){
        if(err) {
            Response.serviceError(res);
            return;
        }
        getUser(connection, username).then(userData => {
            if(userData.length == 0) {
                Response.forbidden(res);
                return;
            }
            const validUser = Crypto.validateHash(password, userData[0]['salt'], userData[0]['hash']);
            if(validUser) {
                const token = Crypto.generateToken(req.get('User-Agent'));
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

function storeToken (connection, userID, token) {
    Debugger.log('HERE HERE');
    return new Promise((resolve, reject) => {
        db.executeQuery({
            query: "INSERT INTO AccessToken(userID, token, expiry) values(?, ?, ?)",
            queryArray: [userID, token, Date.now()],
            connection: connection
        }, function(err, result){
            if(err){
                Debugger.log(err);
                reject(err);
                return;
            }
            Debugger.log('resolving');
            resolve(result);
        });
    });   
}

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