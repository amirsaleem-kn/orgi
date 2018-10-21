/**
 * @author Amir Saleem
 * @description this file contains the application middlewares
 */

const app = require('../core/App');
const bodyParser = require('body-parser');
const compression = require('compression');
const { Logger, Debugger } = require('../etc/logs/logger');
const db = require('../core/Database');
const Response = require('../etc/response_template');

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

const _excludeAuthenticationForPaths = ['/sign-in'];

app.use(function(req, res, next){
  Debugger.log('Verifying Authenticity');
  if(_excludeAuthenticationForPaths.indexOf(req.path) > -1) {
      // we do not need token if user is signing in
      return next();
  }
  // now we need token to authenticate the incoming requests
  authenticateRequest(req, function(authenticated){
      if(authenticated) {
        return next();
      }
      Response.notAuthorized(res);
      return;
  });  
});

function authenticateRequest (req, callback) {
    Debugger.fancy('Authenticating the request');
    var credential = req.get('Authorization') || null;
    var userID = req.get('userID') || null;
    if(!credential || !userID){
        callback(false);
        return;
    }
    var splittedCred = credential.split(' ');
    if(splittedCred[0] != 'Bearer'){
       callback(false);
       return;
    }  
    const userToken = splittedCred[1] || null;
    db.executeQuery({
        query: "SELECT token from AccessToken where userID = ?",
        queryArray: [userID],
        connection: connection
    }, function(err, result){
        if(err) {
            callback(false);
            return;
        }
        if(result.length == 0){
            callback(false);
            return;
        } else if (result[0]['token'] == userToken) {
            callback(true);
        } else {
            callback(false);
        }      
        return;
    });
}