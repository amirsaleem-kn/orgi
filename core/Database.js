const mysql = require('mysql');
const { Logger, Debugger } = require('../etc/logs/logger');
const keys = require('../keys/keys');

const Response = require('../etc/response_template');
/**
 * @description mysql connection pool configuration
 */

const pool = mysql.createPool({
                user: keys.mysql.user,
                password: keys.mysql.password,
                database: keys.mysql.database,
                host: keys.mysql.host,
                connectionTimeout: 2 * 60 * 1000,
                timeout: 120000,
                multipleStatements: true,
                connectionLimit: 20
            });

/**
 * @description top level database class
 */

const db = new function () {
    // retry should be implemented for following codes
    const retryErrorCodes = ['PROTOCOL_CONNECTION_LOST', 'PROTOCOL_SEQUENCE_TIMEOUT'];
    // get an active mysql connection from the pool
    this.getConnection = function (callback, res, retryCount) {
        pool.getConnection((err, connection) => {
            // if retry count is undefined, make it 0
            retryCount ? retryCount = retryCount : retryCount = 0;
            // check for any error during connection acquisiton
            if(err) {
                // should  retry
                if(retryErrorCodes.indexOf(err.code) > -1 && retryCount < 3) {
                    Debugger.fancy('Retrying due to '+err.code);
                    retryCount += 1;
                    return this.getConnection(callback, res, retryCount);
                }
                // some other error has occurred, needs to handle and terminate the process
                handleError(err, null, res);
                callback(err);
                return;
            }
            return callback(null, connection);
        });
    }
    // start a transaction
    this.transactionService = function (connection, callback, res) {
        connection.beginTransaction((err) => {
            if(err) {
                handleError(err, connection, res);
                callback(err);
                return;
            }
            callback(null);
        });
    }
    this.handleTransactionRollback = function (connection, callback, res) {
        connection.rollback((err) => {
            if(err) {
                handleError(err, connection, res);
                callback(err);
                return;
            }
            connetion.release();
            callback(null);
        });
    }
    this.handleTransactionCommit = function (connection, callback, res) {
        connection.commit((err) => {
            if(err) {
                handleError(err, connection, res);
                callback(err);
                return;
            }
            callback(null);
        });
    }
    this.executeQuery = function(options, callback, res){
        const { query, queryArray, connection } = options;
        if(!queryArray) {
            queryArray = [];
        }
        connection.query(query, queryArray, (err, rows) => {
            if(err) {
                handleError(err, connection, res);
                callback(err);
                return;
            }
            callback(null, rows);
        });
    }
}

function handleError (err, connection, res) {
    Logger.log(err);
    if(connection)
        connection.release();
    if(res) {
        Response.serviceError(res);
    }
}

module.exports = db;