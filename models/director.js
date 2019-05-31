const mongoose = require('mongoose');
const Movie = require('./movie');

const directorSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    }
});

directorSchema.pre('remove', function(next){
    Movie.find({director: this.id}, (err, movies) => {
        if(err){
            next(err)
        }else if(movies.length > 0){
            next(new Error ('This director has movies still'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('Director', directorSchema)