var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var flash = require('connect-flash');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes');

var Account = require('./models/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Redis Settings
var redisClient = redis.createClient({host: 'localhost', port: 6379, db:0});
redisClient.auth('RAYWCQUXJBFWYDCY');
app.use(session({
    secret: 'keyboard cat',
    store: new RedisStore({
      client: redisClient
    }),
    resave: false,
    saveUninitialized: false
}));
redisClient.on('connect', function() {
    console.log('Connected to Redis...');
});
redisClient.on('end', function() {
    console.log('Disconnected to Redis...');
});
redisClient.on('error', function(err) {
    console.log('Redis Error ' + err);
});

//Passport Settings
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//MongoDB Settings
var dbName = 'sfrs';
var connectionString = 'mongodb://localhost/' + dbName;
mongoose.connect(connectionString);
mongoose.connection.on('connected', function() {
	  console.log("Connected to MongoDB...");
});
mongoose.connection.on('disconnected', function(err) {
	  console.log("Disconnected to MongoDB");
});
mongoose.connection.on('error', function(err) {
	  console.log("MongoDB Error " + err);
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
