var mongoose = require('mongoose');  
var cpuDataSchema = new mongoose.Schema({  
	cpuData: String
},{timestamps: true});
mongoose.model('cpuData', cpuDataSchema);