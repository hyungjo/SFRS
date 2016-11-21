var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var Activity = new Schema({
  username: String,
  activities: [{
    keyword: String,
    datetime: {type: Date, default: Date.now}
  }]
});

module.exports = mongoose.model('Activity', Activity);
