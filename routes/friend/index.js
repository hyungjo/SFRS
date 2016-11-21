var express = require('express');
var router = express.Router();

var Account = require('../../models/account');

router.get('/', function(req, res, next) {
  res.render('main/friend', {username: req.session.username});
});

router.get('/read', function(req, res, next) {
  Account.find().sort([['regDate', 'desc']]).find(function (err, docs) {
    if(err)
      console.log('Error' + err);
    console.log(docs);
    res.json(docs);
  });
});

router.get('/read/:user', function(req, res, next) {
  Account.findOne({username: req.session.username, friend: {$eq: req.params.user}}, function (err, docs) {
    if(err)
      console.log(err);

    if(!docs)
      res.json({"status": "notfriend"});
    // else if
    //   for(var i = 0; i < docs.length; i++)
    //     if(docs[i].username == req.session.username)
    //       res.json({"status": "me"});
    else
      res.json({"status": "friend"});
  });
});

router.post('/add', function(req, res, next) {
  Account.findOneAndUpdate({username: req.session.username},
    {$push: {"friend": req.body.friendName}},
    {upsert: false},
    function(err, model) {
      if(err)
        console.log(err);
      res.json(model);
    }
  );
});

module.exports = router;
