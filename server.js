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
app.use(bodyParser.json())

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
app.get('/settings', settings);
app.get('/remove', remove)
app.get('/art-galleries/:id', galleryPage);
app.get('/account/:id', accountPage);
app.get('/art-galleries/style/:id', artGalleryPageReset);

app.post('/art-galleries', stylePage);
app.post('/settings', settingsSave);
app.post('/remove', removeAcc);
app.post('/art-galleries/style/:id', stylePageReset);
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
    // db.collection('account').findOne({
    //     _id: mongo.ObjectID(id)
    // }, done)

    var accountResult;
    var expoResults;
    db.collection('account').findOne({_id: mongo.ObjectID(id)}, part2);
    function part2(err,data) {
        accountResult = data;
        db.collection('ArtExpositions').find().toArray(done);
    }


    function done(err, data) {
        if (err) {
          next(err)
        } else {
          expoResults = data;
          for (let i = 0; i < accountResult.expoWishlist.length; i++) {
               accountResult.expoWishlist[i] = expoResults.find(findExpo);
               function findExpo(expo) {
                   return expo._id == accountResult.expoWishlist[i];
               }
           }
          res.render('account', {title: 'Je Account pagina', data: accountResult , id: id, user: req.session.user})
        }
    }
}
function artGalleryPage(req, res){
    db.collection('ArtExpositions').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            var artstyles = [];
            for (i = 0; i < 12; i++) {
                if (!artstyles.includes(data[i].artstyle)) {
                    artstyles.push(data[i].artstyle)
                }
            }
            res.render('artGalleries', {title: 'Art Galleries', artstyles: artstyles, data: data, user: req.session.user});
        }
    }

}
function artGalleryPageReset(req, res){
    var id = req.params.id;

    db.collection('ArtExpositions').find({ artstyle: id }).toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            var artstyles = [];

            res.render('artGalleriesFiltered', {title: 'Art Galleries', data: data, artstyle: id, user: req.session.user});
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
          res.render('galleryDetail', {title: data.name, data: data, user: req.session.user})
        }
    }
}

function stylePage(req, res){
    var style = req.body.artstyle.toLowerCase();

    db.collection('ArtExpositions').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('art-galleries/style/' + style)
        }
    }
}

function stylePageReset(req, res){
    db.collection('ArtExpositions').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('/art-galleries')
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
        expoWishlist:[],
        job: "",
        location: "",
        favArtist: ""
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

function settings(req, res){
    if (!req.session.user){
        return res.redirect('/')
    } else {
        var user = req.session.user
        var ObjectID = require('mongodb').ObjectID;
        db.collection('account').findOne({
            _id: ObjectID(user.name)
        }, done)
    }
    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('settings', {title: settings, data: data, user: req.session.user})
        }
    }
}

function settingsSave(req, res, next){
    var sessionID = req.session.user;
    var accountID = sessionID.name;

    var ObjectID = require('mongodb').ObjectID;
    db.collection('account').updateOne(
        { _id: ObjectID(accountID) },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            job: req.body.werk,
            location: req.body.woonplaats,
            favArtist: req.body.favoriteartist
          }
        }
    , done)


    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.redirect('/account/' + accountID)
        }
    }
}

function remove(req, res){
    db.collection('account').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('remove', {title: "Remove account", data: data, user: req.session.user})
        }
    }
}

function removeAcc(req, res){
    var sessionID = req.session.user;
    var accountID = sessionID.id;
    var ObjectID = require('mongodb').ObjectID;

    db.collection('data').remove(
       { _id: ObjectID(accountID) }
    , done);
    function done(err, data) {
        if (err) {
            next(err)
        } else {
            req.session.destroy();
            res.redirect('/')
        }
    }
}


// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "404 page not found"});
});








app.listen(process.env.PORT, "0.0.0.0", console.log("App is started on port " + port))
