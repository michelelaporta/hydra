var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hydra Home' });
});

//router.get('/partials/:name', function(req, res, next) {
//	var name = req.params.name;
//  res.render('partials/' + name, { title: 'Hydra Home' });
//});

module.exports = router;

/**
exports.index = function(req, res){
	res.render('index', { title: 'Hydra Home' });
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
*/