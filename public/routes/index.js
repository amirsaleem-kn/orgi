const app = require('../../core/App');
const Response = require('../../etc/response_template');
const signIn = require('./sign_in');
const logout = require('./logout');

app.get('/', (req, res) => {
    console.log(res.locals);
    Response.success(res, {
        system: '5 GB',
        cpu: '78%',
        instances: 2,
        summary: {
            network_overheads: 90,
            utilisation: 3,
            min_instance_limit: 34
        }
    })
});

app.post('/sign-in', signIn);
app.post('/logout', logout);