const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// allow cross orgin refrence
app.use(cors({origin: '*'}));

app.set('view engine', 'ejs');
app.set('views', 'view')
app.use(express.static('static'))

app.get('/', function(req, res) {
    res.render('index', {title: 'Home' });
});
app.get('/account', function(req, res) {
    res.render('account', {title: 'Account' });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
