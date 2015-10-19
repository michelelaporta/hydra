
/*
 * GET home page.
 */

exports.show = function(req, res){
  res.render('graph', { title: 'Hydra Monitor', what: 'temperature humidity', jquery:true, socket:true })
};
