const express = require('express');
const router = express.Router();

// Models
const Director = require('../models/director');

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
        //res.redirect(`directors/${director.id}`);
        res.redirect('directors');
    }catch{
        res.render('directors/new', {
            director,
            errorMessage : 'Error creating Director'
        });
    }
});

module.exports = router;