const express = require("express");
const router = express.Router();
const controller = require('../controller/url')



//create short URL

router.post(
    '/url/shorten',
    controller.createShortURL
)






//=========================== if endpoint is not correct==========================================

router.all("/*", function (req, res) {
  res.status(400).send({
    status: false,
    message: "Make Sure Your Endpoint is Correct !!!",
  });
});

module.exports = router;
