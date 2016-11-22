var express = require('express');
var router = express.Router();

var Interest = require('../../models/interest');
var Account = require('../../models/account');
var Posting = require('../../models/posting');

router.get('/', function(req, res, next) {
  res.render('main/interest');
});

router.get('/read', function(req, res, next) {
  Interest.find({username: req.session.username}, {_id:false}, function(err, doc){
    if(err)
      console.log(err)
    res.send(JSON.stringify(doc[0]));
  });
});

router.post('/create', function(req, res, next) {
  console.log('body', req.body);
  var userInterest = new Interest(req.body);
  userInterest.username = req.session.username;
  Interest.remove({username: req.session.username}, function(err){
    if(err)
      console.log(err);
      userInterest.save(function(err, interest){
        if(err)
          console.log(err);
        console.log(nterest);
        res.send(interest);
      });
  });
});

router.post('/activity/create', function(req, res, next) {
  Posting.findOne({_id: req.body.postingId}, function(err, doc){
    if(err)
      console.log(err);
    var activities = [];

    for(var i = 0; i < doc.txtTopic.length; i++)
      activities.push({"keyword": doc.txtTopic[i]});

    Account.findOneAndUpdate({username: req.session.username},
      {$pushAll: {"activity": activities}},
      {upsert: false},
      function(err, model) {
        if(err)
          console.log(err);
        res.json(model);
      }
    );
  });

});

router.get('/activity/read/:user', function(req, res, next) {
  Account.findOne({username: req.params.user}, function(err, docs){
    res.json(docs.activity);
  });
});

module.exports = router;
