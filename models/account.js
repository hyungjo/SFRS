//회원 정보 스키마
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: String,
    name: String,
    password: String,
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
