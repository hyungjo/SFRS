var express = require('express');
var router = express.Router();

var Posting = require('../../models/posting');

router.get('/', function(req, res, next) {
  res.render('main/user', {username: req.session.username});
});

module.exports = router;
