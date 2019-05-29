const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/movie');
const Director = require('../models/director');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// All Movies routes
router.get('/', async (req, res) => {
    let query = Movie.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('releaseDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('releaseDate' , req.query.publishedAfter);
    }
    try{
        const movies = await query.exec();
        res.render('movies/index',{
            movies,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/');
    }
});

// New Movies routes
router.get('/new', async (req, res) => {
    renderNewPage(res, new Movie());
});

// Create movies routes
router.post('/', async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        runningTime: req.body.runningTime,
        category: req.body.category,
        director: req.body.director,
        releaseDate: new Date(req.body.releaseDate)
    })
    saveCover(movie, req.body.cover);

    try{
        const newMovie = await movie.save();
        //res.redirect(`movies/${newMovie.id}`);
        res.redirect('movies');
    }catch{
        renderNewPage(res, movie, true)
    }
});

// function
async function renderNewPage(res, movie, hasError = false){
    try{
        const directors = await Director.find({});
        const params = {
            directors,
            movie
        }
        if(hasError) params.errorMessage = 'Error Creating Movie';
        res.render('movies/new',params)
    }catch{
        res.redirect('/');
    }
}

function saveCover(movie , coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageMimeTypes.includes(cover.type)){
        movie.coverImage = new Buffer.from(cover.data, 'base64');
        movie.coverImageType = cover.type;
    }
}

module.exports = router;