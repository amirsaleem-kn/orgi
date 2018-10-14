const app = require('../core/App');
const { Logger, Debugger } = require('../etc/logs/logger');

/**
 * @description middleware to print request url, method, headers, body and params
 */

app.use(function(req, res, next){
    // any error in this function should not be fatal
    try {
        Debugger.fancy(`[${req.method}]${req.originalUrl}`);
        Debugger.log(`[HEADERS]: ${JSON.stringify(req.headers)}`);
        Debugger.log(`[QUERY]: ${JSON.stringify(req.query)}`);
        Debugger.log(`[PARAMS]: ${JSON.stringify(req.params)}`);
        if(req.method != 'GET' && req.method != 'OPTIONS') {
            Debugger.log(`[BODY]: ${JSON.stringify(req.body)}`);
        }
    } catch (e) {
        Logger.error(e);
    }
    next();
});