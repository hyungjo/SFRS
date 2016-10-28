var express = require('express');
var router = express.Router();

var Interest = require('../../models/interest');

router.get('/', function(req, res, next) {
  res.render('main/interest');
});

router.get('/read', function(req, res, next) {
  Interest.find({}, {_id:false}, function(err, doc){
    if(err)
      console.log(err)
    res.send(JSON.stringify(doc[0]));
  });
});

router.post('/create', function(req, res, next) {
  var userInterest = new Interest(req.body);
  //userInterest.username = req.session.username;

  userInterest.save(function(err, interest){
    if(err)
      console.log(err);
    res.send(interest);
  });
});

module.exports = router;
