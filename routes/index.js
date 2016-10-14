var express = require('express');
var router = express.Router();

var auth = require('./auth');
var timeline = require('./timeline');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use('/auth', auth);
router.use('/timeline', timeline);


router.get('/test', function(req, res, next) {
  res.render('timeline/test.jade');
});

module.exports = router;
