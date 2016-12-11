var express = require('express');
var router = express.Router();

var Posting = require('../../models/posting');

router.get('/', function(req, res, next) {
  var page = 0;
  var perPage = 3;

  Posting.find().limit(perPage).skip(perPage * page).sort([['postingDate', 'desc']]).find(function (err, docs) {
    if(err)
      console.log('Error' + err);

    res.render('timeline/index', {username: req.session.username, postings: docs, pageId: page});
  });
});

router.get('/viewmore', function(req, res, next) {
  var page = 0;
  var perPage = 3;
  var hasPost = true;

  if(req.query.page)
    page = parseInt(req.query.page);

  Posting.find().limit(perPage).skip(perPage * page).sort([['postingDate', 'desc']]).find(function (err, docs) {
    if(err)
      console.log('Error' + err);
    if(docs.length == 0)
      hasPost = false;
    Posting.find().limit(perPage).skip(perPage * (page + 1)).sort([['postingDate', 'desc']]).find(function (err2, isDocs) {
      if(err)
        console.log('Error' + err2);
      if(isDocs.length == 0)
        hasPost = false;
      res.json({postings: docs, pageId: page, status: hasPost});
    });
  });
});

module.exports = router;
