
/*
 * GET home page.
 */
var config = require('../utils/config');

exports.index = function(req, res){
  //res.render('index', { title: 'Hydra Monitor', what: 'temperature humidity', jquery:true, socket:false })
  res.render('index', { title: 'Hydra Monitor', what: 'temperature humidity',author: 'MLP',version: config.version});
};
