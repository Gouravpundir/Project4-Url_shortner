const shortID = require('shortid')
const validURL = require('valid-url')
const urlModel = require('../model/urlModel')


module.exports = {
    createShortURL: async(req, res) => {
       try {
        let {longUrl} = req.body
        if(!Object.keys(req.body).length){
            return  res.status(400).send({
                status: true,
                msg: "Please send some DATA in the request body!"
            })
        }
        if(!longUrl){
            return  res.status(400).send({
                status: true,
                msg: "LongURL is a mandatory field!"
            })
        }
        if(!validURL.isUri(longUrl)){
            return  res.status(400).send({
                status: true,
                msg: "The URL is incorrect!"
            })
        }
        let baseUrl = 'http://localhost:3000'
        let urlCode = shortID.generate()
        let shortUrl = baseUrl + '/' + urlCode

        let checkLongUrl = await urlModel.findOne({longUrl: longUrl})
        if(checkLongUrl){
           return  res.status(200).send({
                status: true,
                msg: "This URL is already present!",
                data: checkLongUrl
            })
        }
        let createURL = await urlModel.create({longUrl, shortUrl, urlCode})
        res.status(201).send({
            status: true,
            msg: "URL created!",
            data: createURL
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