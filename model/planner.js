var mongoose = require('mongoose');  
var plannerSchema = new mongoose.Schema({  
  title: String,
  start: { type: Date},
  end: { type: Date}
});
mongoose.model('Planner', plannerSchema);