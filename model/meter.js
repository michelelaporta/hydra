var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meterSchema = new mongoose.Schema({  
  temperature: String,
  humidity: String,
  water: String,
  water2: String,
  light: String
},{timestamps: true});

var Meter = mongoose.model('Meter', meterSchema);

module.exports = Meter;