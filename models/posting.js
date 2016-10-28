var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var Posting = new Schema({
  username: String,
  title: String,
  description: String,
  imgDir: String,
  imgTags: [String],
  postingDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Posting', Posting);
