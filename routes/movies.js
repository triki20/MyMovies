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
        director: req.body.director,
        description: req.body.description,
        runningTime: req.body.runningTime,
        category: req.body.category,
        releaseDate: new Date(req.body.releaseDate)
    })
    saveCover(movie, req.body.cover);

    try{
        const newMovie = await movie.save();
        res.redirect(`movies/${newMovie.id}`);
    }catch{
        renderNewPage(res, movie, true)
    }
});

//Show Movies routes
router.get('/:id', async (req, res) => {
    try {
     const movie = await Movie.findById(req.params.id).populate('director').exec()
      res.render('movies/show', {movie})
    } catch {
      res.redirect('/')
    }
  })

// Edit Movies routes
router.get('/:id/edit', async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.id)
        renderEditPage(res, movie);
    }catch{
        res.redirect('/')
    }
});

// Update movies routes
router.put('/:id', async (req, res) => {
    let movie
    try{
        movie = await Movie.findById(req.params.id)
        movie.title = req.body.title
        movie.director = req.body.director
        movie.description = req.body.description
        movie.runningTime = req.body.runningTime
        movie.category = req.body.category
        movie.releaseDate = new Date(req.body.releaseDate)
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(movie, req.body.cover)
        }
        await movie.save()
        res.redirect(`/movies/${movie.id}`);
    }catch{
        if(movie != null){
            renderEditPage(res,movie, true)
        }else{
            res.redirect('/')
        }
    }
});

//Delete Movies routes
router.delete('/:id', async (req,res) => {
    let movie
    try{
        movie = await Movie.findById(req.params.id)
        await movie.remove()
        res.redirect('/movies');
    }catch{
        if(movie != null){
            res.render('movies/show', {
                movie,
                errorMessage: 'Could not remove movie'
            })
        }else{
            res.redirect('/')
        }
    }
})

// function render new page
async function renderNewPage(res, movie, hasError = false){
    renderFormPage(res, movie, 'new', hasError)
}

// render Edit page
async function renderEditPage(res, movie, hasError = false){
    renderFormPage(res, movie, 'edit', hasError)
}

// render Form page
async function renderFormPage(res, movie, form, hasError = false){
    try{
        const directors = await Director.find({});
        const params = {
            directors,
            movie
        }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating Movie';
            }else{
                params.errorMessage = 'Error Creating Movie';
            }
        }
        res.render(`movies/${form}`,params)
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