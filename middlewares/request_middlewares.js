const app = require('../core/App');
const { Logger, Debugger } = require('../etc/logs/logger');

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
    // any error in this function should not be fatal
    try {
        Debugger.fancy(`[${req.method}]${req.originalUrl}`);
        // Debugger.log(`[HEADERS]: ${JSON.stringify(req.headers)}`);
        // Debugger.log(`[QUERY]: ${JSON.stringify(req.query)}`);
        // Debugger.log(`[PARAMS]: ${JSON.stringify(req.params)}`);
        // if(req.method != 'GET' && req.method != 'OPTIONS') {
        //     Debugger.log(`[BODY]: ${JSON.stringify(req.body)}`);
        // }
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