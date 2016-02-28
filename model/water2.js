var mongoose = require('mongoose');  
var water2Schema = new mongoose.Schema({  
  water2: String
},{timestamps: true});
mongoose.model('water2', water2Schema);