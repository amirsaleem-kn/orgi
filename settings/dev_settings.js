const keys = require('../keys/keys');
const app_configuration = {
    mysql_conf: {
        user: 'root',
        password: keys.mysql_password,
        database: 'testdb',
        host: 'localhost',
        meta: {
            connectionLimit: 20,
            connectionTimeout: 2 * 60 * 1000,
            timeout: 120000,
            multipleStatements: true
        }
    },
    crypto_vars: {
        algorithm: 'aes-256-ctr'
    } 
};

module.exports = app_configuration;