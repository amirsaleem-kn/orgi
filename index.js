const app = require('./core/App');
const PORT = process.env.PORT || 8080;

require('./middlewares');
require('./public/routes');
const { Debugger, Logger } = require('./etc/logs/logger');

app.listen(PORT, () => {
    Debugger.fancy(`Server listening to port: ${PORT}`);
});