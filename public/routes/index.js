const app = require('../../core/App');
var Response = require('../../etc/response_template');

app.get('/', (req, res) => {
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