const mongoose = require('mongoose')
const shortID = require('shortid')

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        umique: true
    },
    urlCode: {
        type: String,
        unique: true,
        trim: true,
        default: "demo"
    }
})

module.exports = mongoose.model('urlModel', urlSchema)