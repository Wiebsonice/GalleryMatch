const express = require('express');
const cors = require('cors');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongo = require('mongodb');

const app = express();
const port = 3000;
const upload = multer({dest: 'static/upload/'})

require('dotenv').config()

var db = null;
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

const expos = [
{
    id: 1,
    title: "Banksy",
    location: "Stedelijk Museum Amsterdam",
    image: "/assets/profile.jpg"
},
{
    id: 2,
    title: "Van Gogh",
    location: "Van Gogh",
    image: "/assets/header.jpg"
},
{
    id: 3,
    title: "D. Hockney",
    location: "Rijksmuseum",
    image: "/assets/header2.jpg"
},
{
    id: 4,
    title: "Banksy 2",
    location: "Stedelijk Museum Amsterdam",
    image: "/assets/profile.jpg"
},
{
    id: 5,
    title: "Van Gogh 2",
    location: "Van Gogh",
    image: "/assets/header.jpg"
},
{
    id: 6,
    title: "D. Hockney 2",
    location: "Rijksmuseum",
    image: "/assets/header2.jpg"
},
{
    id: 7,
    title: "Banksy 3",
    location: "Stedelijk Museum Amsterdam",
    image: "/assets/profile.jpg"
},
{
    id: 8,
    title: "Van Gogh 3",
    location: "Van Gogh",
    image: "/assets/header.jpg"
},
{
    id: 9,
    title: "D. Hockney 3",
    location: "Rijksmuseum",
    image: "/assets/header2.jpg"
},
{
    id: 10,
    title: "Banksy 4",
    location: "Stedelijk Museum Amsterdam",
    image: "/assets/profile.jpg"
},
{
    id: 11,
    title: "Van Gogh 4",
    location: "Van Gogh",
    image: "/assets/header.jpg"
}
]
const users = [
{
    name: "Peter",
    email: "test@info.nl",
    password: "Yeet",
    cover: ""
}
]

// allow cross orgin resource serving
app.use(cors({origin: '*'}));

app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', homePage);
app.get('/account', accountPage);
app.get('/art-galleries', artGalleryPage);
app.get('/register', registerPage);
app.get('/:id', galleryPage);
app.get('/account/:name', accountPage);

app.post('/register', upload.single('cover'), sendRegister)


function homePage(req, res){
    // res.render('index', {title: 'Home' });

    db.collection('account').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('index', {data:data})
        }
    }
}
function accountPage(req, res){
    res.render('account', {title: 'Account' });
}
function artGalleryPage(req, res){
    res.render('artGalleries', {title: 'Art Galleries', expos: expos });
}
function registerPage(req, res){
    res.render('formPage.ejs', {title: 'Registreren' });
}
function galleryPage(req, res){
    var id = req.params.id;
    res.render('galleryDetail', {title: id, expos:expos, index: id})
}
function accountPage(req, res){
    var name = req.params.id;
    res.render('account', {title: name, users:users})
}

function sendRegister(req, res, next) {
    // var id = slug(req.body.name).toLowerCase()
    // users.push({
    //     name: id,
    //     email: req.body.email,
    //     password: req.body.password,
    //     cover: req.file ? req.file.filename : null
    // })
    //
    // res.redirect('/account/' + id)

    db.collection('account').insertOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cover: req.file ? req.file.filename : null
    }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('/account/' + data)
        }
    }
}


// harvart art api
var rest = require("restler");

// Find all of the objects with the word "dog" in the title and return only a few fields per record
rest.get("https://api.harvardartmuseums.org/object", {
    query: {
        apikey: "0649ad30-7cd9-11e9-bbd3-cdc438639350",
        title: "car",
        fields: "objectnumber,title,dated,image",
    }
}).on("complete", function(data, response) {
    console.log(data);
});



// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "404 page not found"});
});








app.listen(port, () => console.log(`This app is listening on port ${port}!`))
