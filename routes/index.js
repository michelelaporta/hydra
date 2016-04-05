var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hydra Home' });
});

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('index/partials/' + name, {title : 'Hydra Index'});
});

module.exports = router;
