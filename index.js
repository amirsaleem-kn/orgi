const app = require('./core/App');
const { Debugger, Logger } = require('./etc/logs/logger');
const PORT = process.env.PORT || 5000;

require('./middlewares');
require('./public/routes');

app.listen(PORT, () => {
    Logger.log('[Server Started]');
    Debugger.fancy(`Server listening to port: ${PORT}`);
});