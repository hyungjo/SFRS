var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var Interest = new Schema({
  username: String,
  interestname: String,
  class: String,
  nodeDataArray: [{
    text: String,
    key: Number,
    parent: Number,
    loc: String,
    scale: Number,
    font: String
  }]
});

module.exports = mongoose.model('Interest', Interest);
