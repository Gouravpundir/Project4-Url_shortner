const shortid = require('shortid')
const urlModel = require('../model/urlModel')
const redis = require('redis')
const {promisify} = require("util")

//--------------------------------redis-------------------------------------//

const redisClient = redis.createClient(
    18801,
    "redis-18801.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("i4kt77pDL2TaAFET2oKLSyCRbYxfcced", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  })

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)


//----------------------------------create url--------------------------------------//
  
module.exports = {
    createShortURL: async(req, res) => {
    try {
      let originalUrl = req.body.longUrl;
      if (!originalUrl) {
        return res
          .status(400)
          .send({ status: false, msg: "User need to put long url" });
      }
      if (Object.keys(originalUrl).length == 0) {
        return res.status(400).send({
          status: false,
          message: `Request body can't be empty`,
        });
      }
      let checkUrl =
        /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(
          req.body.longUrl
        );
      if (!checkUrl) {
        return res
          .status(400)
          .send({ status: false, msg: "Please provide valid long url" });
      }
  
      const urlCode = shortid.generate().toLowerCase();
      const shortUrl = "http://localhost:3000" + "/" + urlCode;
      let output = {
        longUrl: originalUrl,
        shortUrl: shortUrl,
        urlCode: urlCode,
      };
      let cachedUrl = await GET_ASYNC(`${originalUrl}`);
      if (cachedUrl) {
        let urlData = JSON.parse(cachedUrl);
        return res.status(200).send({
          status: true,
          msg: "Url already exist in redis",
          data: urlData,
        });
      }
      let uniqueUrl = await urlModel
        .findOne({ longUrl: originalUrl })
        .select({ __v: 0, updatedAt: 0, createdAt: 0, _id: 0 });
      if (uniqueUrl) {
        await SET_ASYNC(`${uniqueUrl.longUrl}`, JSON.stringify({ uniqueUrl }));
        return res.status(200).send({
          status: true,
          msg: "Url already exist in database",
          data: uniqueUrl,
        });
      }
      let savedUrl = await urlModel.create(output);
      return res
        .status(201)
        .send({ status: true, msg: "Created data successfully", data: savedUrl });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  },


//----------------------------get url-----------------------------------------//

    getUrl: async (req, res) => {
        try{
            let cacheUrl = await GET_ASYNC(`${req.params.urlCode}`)
            if(cacheUrl){
                cacheUrl = JSON.parse(cacheUrl)
                return   res.status(302).redirect(cacheUrl.longUrl)
            }
            let findURL = await urlModel.findOne({urlCode: req.params.urlCode})
            if(!findURL){
              return   res.status(404).send({
                    status: false,
                    msg: "No such urlCode found!"
                })
            }
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(findURL))
            return   res.status(302).redirect(findURL.longUrl)
        }catch(e){
            res.status(500).send({
                status: false,
                msg: e.message
            })
        }
    }
}