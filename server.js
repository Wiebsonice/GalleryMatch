const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// allow cross orgin resource serving
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

// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
