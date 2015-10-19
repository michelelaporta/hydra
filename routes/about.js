
exports.list = function(req, res){
  //res.send("respond with a resource");
  res.render('about', { title: 'About Hydra', what: 'hydroponics green house management software'})
};