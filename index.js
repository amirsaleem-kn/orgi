const app = require('./core/App');
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`);
});