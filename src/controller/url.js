const shortID = require('shortid')
const validURL = require('valid-url')
const axios = require('axios')
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

        let checkLongUrl = await urlModel.findOne({longUrl: longUrl})
        if(checkLongUrl){
           return  res.status(200).send({
                status: true,
                msg: "This URL is already present!",
                data: checkLongUrl
            })
        }

        let correctLink = false
        await axios.get(longUrl)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                        correctLink = true;
                }
            })
        .catch((error) => { correctLink = false })

        if(!correctLink){
            return res.status(400).send({ status: false, message: "Not a Valid URL !" })
        }
        let baseUrl = 'http://localhost:3000'
        let urlCode = shortID.generate().toLowerCase()
        let shortUrl = baseUrl + '/' + urlCode

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
    },


    getUrl: async (req, res) => {
        try{
            let findURL = await urlModel.findOne({urlCode: req.params.urlCode})
            if(!findURL){
              return   res.status(404).send({
                    status: false,
                    msg: "No such urlCode found!"
                })
            }
            return   res.redirect(findURL.longUrl)
        }catch(e){
            res.status(500).send({
                status: false,
                msg: e.message
            })
        }
    }
}