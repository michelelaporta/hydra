var mongoose = require('mongoose');  
var Conf = new mongoose.Schema({  
	name: String,
	description: String,
	enable : Boolean,
	gpio: String,
	pin: String,
	start:String,
	stop:String,
	target: String,
	rate: String
},{timestamps: true});
//Conf = mongoose.model('confSchema', Conf);

module.exports = Conf;