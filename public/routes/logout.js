/**
 * @author Amir Saleem
 * @description This file contains the logout logic
 */

const db = require('../../core/Database');
const Response = require('../../etc/response_template');

/**
 * @description method to logout the user from application, this method revokes all valid tokens of the user
 * @param {type:object} res http response object
 */

function logout (req, res) {
    const userID = res.locals.userID;
    db.getConnection(function(err, connection){
        if(err) {
            Response.serviceError(res);
            return;
        }
        db.executeQuery({
            query: "Update userTokenStatus set status = ? where userID = ? and status = ?",
            queryArray: ['revoked', userID, 'valid'],
            connection: connection
        }, function(err, data){
            if(err) {
                Response.serviceError(res);
                return;
            }
            connection.release();
            Response.success(res, {
                success: 'logout successfully'
            });
        });
    });
}

module.exports = logout;