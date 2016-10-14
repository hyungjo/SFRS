var express = require('express');
var router = express.Router();

var passport = require('passport');

var Account = require('../../models/account');

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
            res.redirect('/timeline');
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

    req.session.save(function(err){
        if(err) console.log(err);
    });
    console.log('Login::username::::::::::::', req.session.email);
    console.log('Login::email::::::::::::', req.session.username);
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
