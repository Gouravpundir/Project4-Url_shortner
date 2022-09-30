const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true
    },
    urlCode: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowerCse: true
    }
})

module.exports = mongoose.model('url', urlSchema)