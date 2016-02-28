//var timestamps = require('mongoose-timestamp');

var mongoose = require('mongoose');  

var meteoSchema = new mongoose.Schema({  
  temperature: String,
  humidity: String,
  date: { type: Date, default: Date.now },
},{timestamps: true});

meteoSchema.methods.findAll = function (cb) {
  return this.model('meteo').find({}, cb);
}

var Meteo = mongoose.model('meteo', meteoSchema);

module.exports = Meteo;

