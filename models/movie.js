const mongoose = require('mongoose');

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
    coverImage: {
        type: Buffer,
        required: true,
    },
    coverImageType: {
        type: String,
        required: true,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Director'
    }
})

movieSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Movie', movieSchema);
