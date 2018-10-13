const app = require('../core/App');

app.use(function(req, res, next){
    console.log(`[${req.method}]${req.originalUrl}`);
    next();
});