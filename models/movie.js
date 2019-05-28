const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/movieCovers'

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    releaseDate: {
        type: Date,
        required: true
    },
    runningTime: {
        type: Number,
        required: true,
        maxlength: 3
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    createdAd: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        Ref: 'Director'
    }
});

movieSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null){
       return path.join('/', coverImageBasePath , this.coverImageName);
    }
})

module.exports = mongoose.model('Movie', movieSchema);
module.exports.coverImageBasePath = coverImageBasePath