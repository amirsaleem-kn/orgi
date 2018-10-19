const mysql = require('mysql');
const { Logger, Debugger } = require('../etc/logs/logger');
const Response = require('../etc/response_template');

/**
 * @description mysql connection pool configuration
 */

const pool = mysql.createPool({
                user: 'b9082f69ccfec3',
                password: 'a66e767d',
                database: 'heroku_a7abf7a84c87407',
                host: 'us-cdbr-iron-east-05.cleardb.net',
                connectionTimeout: 2 * 60 * 1000,
                timeout: 120000,
                multipleStatements: true,
                connectionLimit: 20
            });

/**
 * @description top level database class
 */

const db = new function () {
    // get an active connection from pool
    this.getConnection = function (callback, res) {
        Debugger.fancy('aquiring a connection from pool');
        pool.getConnection((err, connection) => {
            if(err) {
                Logger.log(err);
                if(err.code == 'PROTOCOL_CONNECTION_LOST') {
                    return this.getConnection(callback);
                }
                if(err) {
                    handleError(err, res);
                    callback(err);
                    return;
                }
            }
            return callback(null, connection);
        });
    }
    // start a transaction
    this.transactionService = function (connection, callback, res) {
        connection.beginTransaction((err) => {
            if(err) {
                handleError(err, res);
                callback(err);
                return;
            }
            callback(null);
        });
    }
    this.handleTransactionRollback = function (connection, callback, res) {
        connection.rollback((err) => {
            if(err) {
                handleError(err);
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
                handleError(err, res);
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
                handleError(err, res);
                callback(err);
                return;
            }
            callback(null, rows);
        });
    }
}

function handleError (err, connection, res) {
    Logger.log(err);
    connection.release();
    if(res) {
        Response.serviceError(res);
    }
}

module.exports = db;