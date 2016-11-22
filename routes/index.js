var express = require('express');
var router = express.Router();

var auth = require('./auth');
var timeline = require('./timeline');
var posting = require('./posting');
var interest = require('./interest');
var friend = require('./friend');
var user = require('./user');
var tool = require('./tool');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/test', function(req, res, next) {
  res.render('main/test');
});

router.use('/auth', auth);
router.use('/timeline', timeline);
router.use('/posting', posting);
router.use('/interest', interest);
router.use('/friend', friend);
router.use('/user', user);
router.use('/tool', tool);

module.exports = router;
