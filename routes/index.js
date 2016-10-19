var express = require('express');
var router = express.Router();

var auth = require('./auth');
var timeline = require('./timeline');
var posting = require('./posting');
var interest = require('./interest');
var tool = require('./tool');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use('/auth', auth);
router.use('/timeline', timeline);
router.use('/posting', posting);
router.use('/interest', interest);
router.use('/tool', tool);

router.get('/test', function(req, res, next) {
  res.render('timeline/test.jade');
});

module.exports = router;
