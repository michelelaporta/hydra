var mongoose = require('mongoose');  
var waterSchema = new mongoose.Schema({  
  water: String
},{timestamps: true});
mongoose.model('water', waterSchema);