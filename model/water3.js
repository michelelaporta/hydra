var mongoose = require('mongoose');  
var water3Schema = new mongoose.Schema({  
  water3: String
},{timestamps: true});
mongoose.model('water3', water3Schema);