const express = require('express');
const cors = require('cors');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongo = require('mongodb');
const session = require('express-session');
const path = require('path');

// bcrypt info from https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
var port = process.env.PORT || 3000;
const upload = multer({dest: 'static/upload/'})

require('dotenv').config()

var db = null;
var url = process.env.DB_HOST;

mongo.MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
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
app.get('/login', loginPage);
app.get('/log-out', logout);
app.get('/art-galleries/:id', galleryPage);
app.get('/account/:id', accountPage);

app.post('/register', upload.single('cover'), sendRegister);
app.post('/login', sendLogin);
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

    // test met data uit 2 collecties, niet gelukt
    // var accountResult = db.collection('account').findOne({_id: mongo.ObjectID(id)});
    // var expoResults = db.collection('ArtExpositions').find().toArray();
    // Promise.all([accountResult, expoResults]).then(function(values) {
    //   console.log(value)
    // });



    function done(err, data) {
        if (err) {
          next(err)
        } else {

          res.render('account', {title: 'Je Account pagina', data: data, id: id, user: req.session.user})
        }
    }
}
function artGalleryPage(req, res){
    db.collection('ArtExpositions').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('artGalleries', {title: 'Art Galleries', data: data, user: req.session.user});
        }
    }

}
function registerPage(req, res){
    res.render('formPage.ejs', {title: 'Registreren' });
}
function loginPage(req, res){
    res.render('formPage.ejs', {title: 'log-in' });
}
function logout(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
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

function sendLogin(req, res, next){
    var userEmail = req.body.email
    var userPassword = req.body.password
    db.collection('account').findOne({
        email: req.body.email
    }, done)


    function done(err, data) {
        if (err) {
          next(err)
        } if (!data){
            console.log("No user found with this email")
        } else {
            var result = bcrypt.compareSync(userPassword, data.password);
            if (result) {
                req.session.user = {name: data._id}
                res.redirect('/')
            } else {
                res.status(401).send('Wachtwoord incorrect')
            }
        }
    }
}

function sendRegister(req, res, next) {
    var naam = slug(req.body.name).toLowerCase()
    var pwd = req.body.password;
    var hash = bcrypt.hashSync(pwd, saltRounds);
    db.collection('account').insertOne({
        name: req.body.name,
        email: req.body.email,
        password: hash,
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

// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "404 page not found"});
});








app.listen(process.env.PORT, "0.0.0.0", console.log("App is started on port " + port))
