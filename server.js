const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

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

// allow cross orgin resource serving
app.use(cors({origin: '*'}));

app.set('view engine', 'ejs');
app.set('views', 'view')
app.use(express.static('static'))

app.get('/', homePage);
app.get('/account', accountPage);
app.get('/art-galleries', artGalleryPage)
app.get('/:id', galleryPage)


function homePage(req, res){
    res.render('index', {title: 'Home' });
}
function accountPage(req, res){
    res.render('account', {title: 'Account' });
}
function artGalleryPage(req, res){
    res.render('artGalleries', {title: 'Art Galleries', expos: expos });
}
function galleryPage(req, res){
    var id = req.params.id;
    res.render('galleryDetail', {title: id, expos:expos, index: id})
}


// 404 status route set.
app.use(function(req, res, next){
    res.status(404).render('404', {title: "404 page not found"});
});








app.listen(port, () => console.log(`This app is listening on port ${port}!`))
