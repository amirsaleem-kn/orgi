const app = require('../../core/App');

app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "yay!, data found"
    });
});