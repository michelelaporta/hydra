var mongoose = require('mongoose');  
var sampleSchema = new mongoose.Schema({  
	sampleData: String
},{timestamps: true});
mongoose.model('sample', sampleSchema);