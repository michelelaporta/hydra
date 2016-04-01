var mongoose = require('mongoose');  
var confSchema = new mongoose.Schema({  
	conf: String
},{timestamps: true});
mongoose.model('confSchema', confSchema);