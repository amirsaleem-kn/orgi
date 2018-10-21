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
const JWT = require('../public/web_token');

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
  authenticateRequest(req, function(authenticated, message){
      if(authenticated) {
        res.locals.userID = message.userId;
        res.locals.username = message.username;
        return next();
      }
      if(message == 'system_fault'){
        Response.serviceError(res);
        return;
      }
      Response.notAuthorized(res);
      return;
  });  
});

/**
 * @description method to authenticate the incoming requests using json web token
 * @param {type:object} req an http request object
 * @param {type:function} callback callback function to be executed on success or failure
 */

function authenticateRequest (req, callback) {
    Debugger.fancy('Authenticating the request');
    var credential = req.get('Authorization') || null;
    if(!credential){
        callback(false);
        return;
    }
    var splittedCred = credential.split(' ');
    if(splittedCred[0] != 'Bearer'){
       callback(false);
       return;
    }  
    const userToken = splittedCred[1] || null;
    // verify the token using jwt
    JWT.verify(userToken, function(err, message){
        // if token is expired, send 401
        if(err) {
            callback(false);
        } else {
            // get an active mysql connection
            db.getConnection(function(err, connection){
                if(err){
                    callback(false, 'system_fault');
                } else {
                    // compare the token passed with what is stored in the database along with its status
                    db.executeQuery({
                        query: "SELECT status from userTokenStatus where userID = ? and status = ? and token = ?",
                        queryArray: [message.userId,'valid',userToken],
                        connection: connection
                    }, function(err, data){
                        if(err) {
                            callback(false, 'system_fault');
                            return;
                        }
                        // release the connection
                        connection.release();
                        // if token not found in database
                        if(data.length == 0){
                            callback(false);
                            return;
                        }
                        // authentication has been successful
                        callback(true, message);
                    });
                }
            });
        }
    });
    return;
}