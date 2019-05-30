const express = require('express');
const router = express.Router();

// Models
const Director = require('../models/director');
const Movie = require('../models/movie');

// All directors routes
router.get('/', async (req , res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const directors = await Director.find(searchOptions);
        res.render('directors/index' , {
            directors,
            searchOptions: req.query
        });
    }catch{
        res.redirect('/');
    }
});

// New directors routes
router.get('/new', (req , res) => {
    res.render('directors/new', { director: new Director() }); // director == _form_fields
});

// Create directors routes
router.post('/', async (req , res) => {
    const director = new Director({
        name: req.body.name  //directorName
    })
    try{
        const newDirector = await director.save()
        res.redirect(`directors/${director.id}`);
    }catch{
        res.render('directors/new', {
            director,
            errorMessage : 'Error creating Director'
        });
    }
});


// View director routes
router.get('/:id', async (req, res) => {
    try{
        const director = await Director.findById(req.params.id);
        const movies = await Movie.find({ director: director.id }).limit(6).exec()
        res.render(`directors/show`, {
            director,
            movieByDirector: movies
        })
    }catch{
        res.redirect('/');
    }
});

// Edit director routes
router.get('/:id/edit', async (req, res) => {
    try{
        const director = await Director.findById(req.params.id);
        res.render('directors/edit', { director });
    }catch{
        res.redirect('directors');
    }
});

// Update director routes
router.put('/:id', async (req, res) => {
    let director
    try{
        director = await Director.findById(req.params.id);
        director.name = req.body.name;
        await director.save();
        res.redirect(`/directors/${director.id}`);
    }catch{
        if(director == null){
            res.redirect('/');
        }else{
            res.render('directors/edit', {
                director,
                errorMessage : 'Error Updating Director'
            })
        }
    }
});


// Delete director routes
router.delete('/:id', async (req, res) => {
    let director
    try{
        director = await Director.findById(req.params.id);
        await director.remove();
        res.redirect('/directors');
    }catch{
        if(director == null){
            res.redirect('/');
        }else{
            res.redirect(`/directors/${director.id}`)
        }
    }
});

module.exports = router;