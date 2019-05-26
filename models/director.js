const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Director', directorSchema)