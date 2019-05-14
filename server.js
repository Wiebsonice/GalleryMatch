const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'view')

app.get('/', function(req, res) {
    res.render('index');
});
app.get('/about', function(req, res) {
    res.render('about');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
