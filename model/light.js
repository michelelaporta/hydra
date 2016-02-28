var mongoose = require('mongoose');  
var waterSchema = new mongoose.Schema({  
	light: String,
  date: { type: Date, default: Date.now },
});
mongoose.model('light', waterSchema);