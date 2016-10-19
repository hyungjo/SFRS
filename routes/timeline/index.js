var express = require('express');
var router = express.Router();

var Posting = require('../../models/posting');

router.get('/', function(req, res, next) {
  Posting.find().sort([['postingDate', 'desc']]).find(function (err, docs) {
    if(err)
      console.log('##Error' + err);

    res.render('main/index', {username: req.session.username, postings: docs});
  });
});

router.get('/me', function(req, res, next) {
  Posting.find({email: req.session.email}).sort([['postingDate', 'desc']]).find(function (err, docs) {
    if(err)
      console.log('##Error' + err);

    res.render('main/index', {username: req.session.username, postings: docs});
  });
});

module.exports = router;
