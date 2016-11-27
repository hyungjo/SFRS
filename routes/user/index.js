var express = require('express');
var router = express.Router();
var request = require('request');

var Posting = require('../../models/posting');
var Account = require('../../models/account');

router.get('/', function(req, res, next) {
  res.render('main/user', {username: req.session.username});
});

router.get('/activity', function(req, res, next) {
  //activity frequency
  var activities = [];
  Account.findOne({username: req.session.username}, function(err, doc){
    if(err)
      console.log(err);
    for(var i = 0; i < doc.activity.length; i++){
      activities.push(doc.activity[i].keyword);
    }
    var  count = {};

    activities.forEach(function(i) { count[i] = (count[i]||0)+1;  });
    res.json(count);
  });
});

router.get('/activity/:user', function(req, res, next) {
  //activity frequency
  var activities = [];
  Account.findOne({username: req.params.user}, function(err, doc){
    if(err)
      console.log(err);
    for(var i = 0; i < doc.activity.length; i++){
      activities.push(doc.activity[i].keyword);
    }
    var  count = {};

    activities.forEach(function(i) { count[i] = (count[i]||0)+1;  });
    res.json(count);
  });
});


router.get('/activity/compare/:user', function(req, res, next) {
  var result = {};
  var count = 0;

  request.get('http://localhost:3000/user/activity/' + req.params.user, function(err, bodyA){
    if(err)
      console.log(err);
    var userA = JSON.parse(bodyA.body);

    request.get('http://localhost:3000/user/activity/' + req.session.username, function(err, bodyB){
      if(err)
        console.log(err);
      var userB = JSON.parse(bodyB.body);

      for(a in userA)
        for(b in userB)
          if(a == b){
            result[a] = Math.min(userA[a], userB[b]);
            break;
          }

      for(key in result){
        count += result[key];
      }
      res.json({activity: result, score: count});
    });
  });
});


module.exports = router;
