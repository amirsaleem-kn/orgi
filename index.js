const app = require('./core/App');
const PORT = process.env.PORT || 8080;

require('./middlewares');

app.get('/', function(req, res, next){
    res.json({
        status: "success"
    })
});

app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`);
});