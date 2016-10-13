var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/timeline', function(req, res, next) {
  res.render('timeline/index.jade');
});
router.get('/test', function(req, res, next) {
  res.render('timeline/test.jade');
});

module.exports = router;
