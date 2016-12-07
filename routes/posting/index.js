var express = require('express');
var router = express.Router();

var multer = require('multer');
var fs = require('fs');
var request = require('request');
var util = require('util');

var Posting = require('../../models/posting');
var Account = require('../../models/account');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

router.get('/count/:user', function(req, res, next){
  Posting.find({username: req.params.user}, function(err, docs){
    if(err)
      console.log(err);
    res.json({count: docs.length});
  });
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
    var activities = [];

    var options = { method: 'POST',
      url: 'http://api.meaningcloud.com/class-1.1',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form:
       { key: '7656060d9f1ea047e055524c909df0d8',
         txt: posting.title + ' ' + posting.description + ' ' + posting.imgTags,
         model: 'IAB_en' } };

    request(options, function (error, response, txtBody) {
      //console.log(JSON.parse(txtBody));
      var txtTopic = JSON.parse(txtBody);
      var txtTopics = [];
      if (error) throw new Error(error);
      for(var i = 0; i < txtTopic.category_list.length; i++) {
        txtTopics.push(txtTopic.category_list[i].code);
        activities.push({"keyword": txtTopic.category_list[i].code});
      }
      posting.txtTopic = txtTopics;
      posting.save(function(err, doc){
        if(err)
          console.log(err);
        //console.log(doc);
        Account.findOneAndUpdate({username: req.session.username},
          {$pushAll: {"activity": activities}},
          {upsert: false},
          function(err, model) {
            if(err)
              console.log(err);
            res.redirect('/timeline');
          }
        );
      });
    });
  });
});

module.exports = router;
