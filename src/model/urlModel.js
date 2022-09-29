const mongoose = require('mongoose')
const shortID = require('shortid')

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true
    },
    urlCode: {
        type: String,
        unique: true,
        trim: true
    }
})

module.exports = mongoose.model('urlModel', urlSchema)