const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Models
const Movie = require('../models/movie');
const Director = require('../models/director');

//Multer
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', Movie.coverImageBasePath);
const upload = multer({
    dest: uploadPath, // Where to store the files
    fileFilter: (req, file, callback) => {   //Function to control which files are accepted
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}) 

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
router.post('/', upload.single('cover'), async (req, res) => {
   const fileName = req.file != null ? req.file.filename : null
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        runningTime: req.body.runningTime,
        category: req.body.category,
        director: req.body.director,
        coverImageName: fileName,
        releaseDate: new Date(req.body.releaseDate)
    })

    try{
        const newMovie = await movie.save();
        //res.redirect(`movies/${newMovie.id}`);
        res.redirect('movies');
    }catch{
        if(movie.coverImageName != null){
            removeMovieCaver(movie.coverImageName);
        }
        renderNewPage(res, movie, true)
    }
});

function removeMovieCaver(fileName){
    fs.unlink(path.join(uploadPath, fileName) , (err) => {
        if(err) console.log(err)
    })
}

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

module.exports = router;