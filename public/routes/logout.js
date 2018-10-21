/**
 * @author Amir Saleem
 * @description This file contains the logout logic
 */

const db = require('../../core/Database');
const Response = require('../../etc/response_template');
const Crypto = require('../../core/Crypto');
const { base64_decode } = require('../../lib/common/helper_functions');
const { Debugger, Logger } = require('../../etc/logs/logger');
const keys = require('../../keys/keys');
const JWT = require('../web_token');

function logout (req, res) {
    const userID = res.locals.userID;
    db.getConnection(function(err, connection){
        if(err) {
            Response.serviceError(res);
            return;
        }
        db.executeQuery({
            query: "Update userTokenStatus set status = ? where userID = ?",
            queryArray: ['revoked', userID],
            connection: connection
        }, function(err, data){
            if(err) {
                Response.serviceError(res);
                return;
            }
            Response.success(res, {
                success: 'logout successfully'
            });
        });
    });
}

module.exports = logout;