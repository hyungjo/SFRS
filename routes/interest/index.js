var express = require('express');
var router = express.Router();

var Interest = require('../../models/interest');

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

module.exports = router;
