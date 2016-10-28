var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require('fs');
var request = require('request');
var util = require('util');

var Posting = require('../../models/posting');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

router.post('/create', multer({ storage: storage}).single('imgfile'), function(req, res, next) {
  var posting = new Posting({
    username: req.session.username,
    title: req.body.title,
    description: req.body.description,
    postingDate: Date.now(),
    imgDir: req.file.filename
  });

  request.get('http://localhost:3000/tool/img/tag/' + req.file.filename, function(err, responses, body) {
    posting.imgTags = JSON.parse(body);
    //console.log(util.inspect(body, false, null));
    posting.save(function(err){
      if(err)
        console.log(err);
      res.redirect('/timeline');
    });
  });
});

module.exports = router;
