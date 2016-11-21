var express = require('express');
var router = express.Router();

var passport = require('passport');

var Account = require('../../models/account');
var Interest = require('../../models/interest');

router.post('/register', function(req, res, next) {
    Account.register(new Account({
      username : req.body.username,
      email : req.body.email,
     }), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
          return res.render('index', {error : err.message});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.username = req.body.username;
            req.session.email = req.body.email;

            req.session.save(function(err){
                if(err) console.log(err);
            });
            console.log('Registered::username::::::::::::', req.session.username);
            console.log('Registered::email::::::::::::', req.session.email);

            //Default Interest Setting
            var defaultInterest = new Interest({
              "username" : req.session.username,
              "class" : "go.TreeModel",
              "nodeDataArray" : [
                  {
                      "key" : 0,
                      "text" : "InterestName",
                      "loc" : "-778 -89.99999999999994",
                      "scale" : 1.331,
                      "font" : "bold 13px sans-serif"
                  },
                  {
                      "text" : "When",
                      "parent" : 0,
                      "key" : -2,
                      "loc" : "-648.3692734375002 -152.51749999999976"
                  },
                  {
                      "text" : "Who",
                      "parent" : 0,
                      "key" : -5,
                      "loc" : "-648.3692734375002 -126.51749999999993"
                  },
                  {
                      "text" : "How",
                      "parent" : 0,
                      "key" : -12,
                      "loc" : "-648.3692734375002 -100.51749999999991"
                  },
                  {
                      "text" : "Where",
                      "parent" : 0,
                      "key" : -6,
                      "loc" : "-648.3692734374999 -74.51749999999994"
                  },
                  {
                      "text" : "What",
                      "parent" : 0,
                      "key" : -7,
                      "loc" : "-648.3692734374999 -48.51749999999994"
                  },
                  {
                      "text" : "Why",
                      "parent" : 0,
                      "key" : -8,
                      "loc" : "-648.3692734374999 -22.51749999999994"
                  }
              ]
            });
            defaultInterest.save(function(err){
              if(err)
                console.log('Default Interest generation Error');
              res.redirect('/timeline');
            });

            // req.session.save(function (err) {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.redirect('/dashboard');
            // });
        });
    });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/'}), function(req, res, next) {
    req.session.username = req.body.username;
    //req.session.email = req.body.email;
    req.session.save(function(err){
        if(err) console.log(err);
    });
    console.log('Login::username::::::::::::', req.session.username);
    console.log('Login::email::::::::::::', req.session.email);
    res.redirect('/timeline');
});

router.get('/logout', function(req, res, next) {
  console.log('Logout::username::::::::::::', req.session.username);
  console.log('Logout::email::::::::::::', req.session.email);
  req.session.destroy(function(err){
      if(err) console.log(err);
  });
  req.logout();
  res.redirect('/');
});

module.exports = router;
