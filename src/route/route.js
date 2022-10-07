const express = require("express");
const router = express.Router();



//imported controller
const {createShorturl,fetchUrlData}=require('../controller/url')




//create short url
router.post("/url/shorten",createShorturl)



//get url data
router.get("/:urlCode",fetchUrlData)

module.exports = router;
