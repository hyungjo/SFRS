var express = require('express');
var router = express.Router();

var request = require('request');

var Interest = require('../../models/interest');
var Account = require('../../models/account');
var Posting = require('../../models/posting');

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

router.get('/read/:user', function(req, res, next) {
  Interest.find({username: req.params.user}, {_id:false}, function(err, doc){
    if(err)
      console.log(err)
    res.send(JSON.stringify(doc[0]));
  });
});

router.post('/create', function(req, res, next) {
  //console.log('body', req.body);
  var userInterest = new Interest(req.body);
  userInterest.username = req.session.username;
  Interest.remove({username: req.session.username}, function(err){
    if(err)
      console.log(err);
      userInterest.save(function(err, interest){
        if(err)
          console.log(err);
        //console.log(nterest);
        res.send(interest);
      });
  });
});

router.get('/compare/:user', function(req, res, next){
  var myInterest = "";
  var otherInterest = "";

  Interest.findOne({username: req.params.user}, function(err, other){
    if(err)
      console.log(err);
    otherInterest = convert(other.nodeDataArray);
    Interest.findOne({username: req.session.username}, function(err, my){
      if(err)
        console.log(err);
      myInterest = convert(my.nodeDataArray);
      request({
          url: 'http://swoogle.umbc.edu/StsService/GetStsSim', //URL to hit
          qs: {phrase1: myInterest, phrase2: otherInterest, operation: 'api'}, //Query string data
          method: 'GET' //Specify the method
      }, function(error, response, body){
          if(error) {
              console.log(error);
          } else {
              res.json({other: otherInterest, my: myInterest, sim: JSON.parse(body)});
          }
      });
    });
  });
});

router.post('/activity/create', function(req, res, next) {
  Posting.findOne({_id: req.body.postingId}, function(err, doc){
    if(err)
      console.log(err);
    var activities = [];

    for(var i = 0; i < doc.txtTopic.length; i++)
      activities.push({"keyword": doc.txtTopic[i]});

    Account.findOneAndUpdate({username: req.session.username},
      {$pushAll: {"activity": activities}},
      {upsert: false},
      function(err, model) {
        if(err)
          console.log(err);
        res.json(model);
      }
    );
  });

});

router.get('/activity/read/:user', function(req, res, next) {
  Account.findOne({username: req.params.user}, function(err, docs){
    res.json(docs.activity);
  });
});

function convert(rows) {
    function exists(rows, parent) {
            for (var i = 0; i < rows.length; i++) {
                    if (rows[i].key == parent) return true;
            }
            return false;
    }
    var nodes = [];
    var result = "";
    var who="", how="", what="", when="", where="", why="";

    // get the top level nodes
    for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!exists(rows, row.parent)) {
                    nodes.push({
                            key: row.key,
                            text: row.text
                    });
            }
    }
    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
            toDo.push(nodes[i]);
    }
    while (toDo.length) {
            var node = toDo.shift();
            // the parent node
            // get the children nodes
            for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.parent == node.key) {
                            var child = {
                                    key: row.key,
                                    text: row.text
                            };
                            if (node.children) {
                                    node.children.push(child);
                            } else {
                                    node.children = [child];
                            }
                            toDo.push(child);
                    }
            }
    }

    result += nodes[0].text + " - ";

    for(var i = 0; i < nodes[0].children.length; i++){
      if(!nodes[0].children[i].hasOwnProperty('children'))
        continue;
      switch(nodes[0].children[i].text){
        case "Who" : who = nodes[0].children[i].children[0].text + " "; break;
        case "How" : how = nodes[0].children[i].children[0].text + " "; break;
        case "What" : what = nodes[0].children[i].children[0].text + " "; break;
        case "When" : when = "on " + nodes[0].children[i].children[0].text + " "; break;
        case "Where" : where = "in " + nodes[0].children[i].children[0].text + " "; break;
        case "Why" : why = "for " + nodes[0].children[i].children[0].text + " "; break;
      }
    }
    result += who + how + what + when + where + why;

    return result;

  }

module.exports = router;
