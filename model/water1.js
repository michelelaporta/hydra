var mongoose = require('mongoose');  
var water1Schema = new mongoose.Schema({  
  water1: String
},{timestamps: true});
mongoose.model('water1', water1Schema);