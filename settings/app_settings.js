const env = process.env.NODE_ENV;

if(env == 'production'){
    module.exports = require('./prod_settings.js');
} else {
    module.exports = require('./dev_settings.js');
}