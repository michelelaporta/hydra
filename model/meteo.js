var mongoose = require('mongoose');  
var preferencesSchema = new mongoose.Schema({  
  temperature: String,
  humidity: String
});
mongoose.model('meteo', preferencesSchema);