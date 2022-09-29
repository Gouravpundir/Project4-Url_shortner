const shortID = require('shortid')
const validURL = require('valid-url')
const urlModel = require('../model/urlModel')


module.exports = {
    createShortURL: async(req, res) => {
       try {
        let data = req.body
       // req.urlCode = shortID.generate()
        let createURL = await urlModel.create(req.body)
        res.status(201).send({
            status: true,
            msg: "URL created!",
            data: data
        })
    }
    catch(e){
        res.status(500).send({
            status: false,
            msg: e.message
        })
    }
    }
}