const app = require('./core/App');
const { Debugger, Logger } = require('./etc/logs/logger');
const PORT = process.env.PORT || 4000;

require('./middlewares');
require('./public/routes');
const db = require('./core/Database');

function executeQuery () {
    db.getConnection(function (err, connection) {
        if(err) {
            throw err;
        }
        db.executeQuery({query:"show tables", queryArray: [], connection: connection}, function(err, tables){
            if(err) {
                throw err;
            }
            connection.release();
            console.log(tables);
        });
    });
}

//executeQuery();

app.listen(PORT, () => {
    Debugger.fancy(`Server listening to port: ${PORT}`);
});