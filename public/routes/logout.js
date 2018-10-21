/**
 * @author Amir Saleem
 * @description This file contains the logout logic
 */

const db = require('../../core/Database');
const Response = require('../../etc/response_template');

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