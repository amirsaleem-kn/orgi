const app = require('../core/App');
const bodyParser = require('body-parser');
const compression = require('compression');
const { Logger, Debugger } = require('../etc/logs/logger');

/**
 * @description external middlewares
 */

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ "limit": "50mb", extended: true, parameterLimit: 1000000 }))
app.use(compression()); //compressing payload on every request

/**
 * @description response methods middleware
 */

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, appID, empID, version, token, allow-access");
    next();
});

/**
 * @description middleware to print request url, method, headers, body and params
 */

app.use(function(req, res, next){
    // any error in this function must not be fatal
    try {
        Debugger.fancy(`[${req.method}]${req.originalUrl}`);
    } catch (e) {
        Logger.error(e);
    }
    next();
});

/**
 * @description authentication middleware
 */

app.use(function(req, res, next){
  Debugger.log('Verifying Authenticity');
  next();  
});