var express = require('express');
var router = express.Router();

var Posting = require('../../models/posting');
var Account = require('../../models/account');

router.get('/', function(req, res, next) {
  res.render('main/user', {username: req.session.username});
});

router.get('/activity', function(req, res, next) {
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

module.exports = router;
