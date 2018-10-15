const env = process.env.NODE_ENV;

if(env == 'production'){
    module.exports = require('./prod.js');
} else {
    module.exports = require('./dev.js');
}