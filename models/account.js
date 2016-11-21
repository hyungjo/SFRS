//회원 정보 스키마
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    email: String,
    password: String,
    regDate: {type: Date, default: Date.now},
    friend: [String],
    activity: [{keyword: String, date: {type: Date, default: Date.now}}]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
