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
    var options = { method: 'POST',
      url: 'http://api.meaningcloud.com/class-1.1',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form:
       { key: '7656060d9f1ea047e055524c909df0d8',
         txt: posting.title + ' ' + posting.description,
         model: 'IAB_en' } };

    request(options, function (error, response, txtBody) {
      console.log(JSON.parse(txtBody));
      var txtTopic = JSON.parse(txtBody);
      var txtTopics = [];
      if (error) throw new Error(error);
      for(var i = 0; i < txtTopic.category_list.length; i++)
        txtTopics.push(txtTopic.category_list[0].code);
      posting.txtTopic = txtTopics;
      posting.save(function(err){
        if(err)
          console.log(err);
        res.redirect('/timeline');
      });
    });
  });
});

module.exports = router;
