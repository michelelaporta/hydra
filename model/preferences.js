var mongoose = require('mongoose');  
var preferencesSchema = new mongoose.Schema({  
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean
});
mongoose.model('Preferences', preferencesSchema);