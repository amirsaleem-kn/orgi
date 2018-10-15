const app = require('./core/App');
const { Debugger, Logger } = require('./etc/logs/logger');
const PORT = process.env.PORT || 5000;
const { platform, arch, cpus, hostname, type, userInfo, freemem } = require('os');
const cluster = require('cluster');
const CPUs = cpus().length;

require('./middlewares');
require('./public/routes');

if (cluster.isMaster){
    console.log(`Master ${process.pid} is running`);
    for(let i = 0; i < CPUs; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`worker ${process.pid} started`);
    app.listen(PORT, () => {
        Logger.log({
            platform: platform(),
            architecture: arch(),
            cores: cpus().length,
            hostname: hostname(),
            type: type(),
            userinfo: userInfo(),
            free_memory: freemem() + ' bytes'
        });
        Debugger.fancy(`Server listening to port: ${PORT}`);
    });
}