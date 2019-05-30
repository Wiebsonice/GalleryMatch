const express = require('express');
const cors = require('cors');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongo = require('mongodb');
const session = require('express-session');

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


// allow cross orgin resource serving from: https://flaviocopes.com/express-cors/
app.use(cors({origin: '*'}));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', homePage);
app.get('/account', accountPage);
app.get('/art-galleries', artGalleryPage);
app.get('/register', registerPage);
app.get('/art-galleries/:id', galleryPage);
app.get('/account/:id', accountPage);

app.post('/register', upload.single('cover'), sendRegister);
app.post('/art-galleries/:id', addToWishlist);


function homePage(req, res){
    // res.render('index', {title: 'Home' });

    db.collection('account').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('index', {data: data, title: 'Home', user: req.session.user})
        }
    }
}
function accountPage(req, res){
    var id = req.params.id
    db.collection('account').findOne({
        _id: mongo.ObjectID(id)
    }, done)

    function done(err, data) {
        if (err) {
          next(err)
        } else {
          res.render('account', {title: 'Je Account pagina', data: data})
        }
    }
}
function artGalleryPage(req, res){
    db.collection('ArtExpositions').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('artGalleries', {title: 'Art Galleries', data: data});
        }
    }

}
function registerPage(req, res){
    res.render('formPage.ejs', {title: 'Registreren' });
}
function galleryPage(req, res){
    var id = req.params.id
    db.collection('ArtExpositions').findOne({
        _id: mongo.ObjectID(id)
    }, done)

    function done(err, data) {
        if (err) {
          next(err)
        } else {
          res.render('galleryDetail', {title: data.name, data: data,user: req.session.user})
        }
    }
}

function addToWishlist(req, res, next) {
    var expoID = req.params.id;
    var sessionID = req.session.user;
    var accountID = sessionID.name;
    console.log(accountID)
    console.log(expoID)

    // db.collection('account').updateOne(
    //     { _id : accountID },
    //     { $push : { expoWishlist : expoID } }
    // , done)

    // Hulp van Rijk.
    var ObjectID = require('mongodb').ObjectID;

    db.collection('account').updateOne(
      { _id: ObjectID(accountID) },
      {
        $push: {
          expoWishlist: expoID
        }
      }
    , done);

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('/account/' + accountID)
        }
    }
}

function sendRegister(req, res, next) {
    var naam = slug(req.body.name).toLowerCase()
    db.collection('account').insertOne({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cover: req.file ? req.file.filename : null,
        expoWishlist:[]
    }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            // sessions help van danny
            req.session.user = {name: data.ops[0]._id}
            res.redirect('/account/' + data.insertedId)
        }
    }
}


// harvart art api
// var rest = require("restler");
//
// rest.get("https://api.harvardartmuseums.org/object", {
//     query: {
//         apikey: "0649ad30-7cd9-11e9-bbd3-cdc438639350",
//         title: "car",
//         fields: "objectnumber,title,dated,image",
//     }
// }).on("complete", function(data, response) {
//     console.log(data);
// });



// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "404 page not found"});
});








app.listen(port, () => console.log(`This app is listening on port ${port}!`))
