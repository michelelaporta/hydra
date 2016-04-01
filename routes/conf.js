var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res, next) {
	res.render('conf', {title : 'Hydra Conf',what : 'Conf',author : 'MLP'});
});

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('conf/partials/' + name, {title : 'Hydra Conf'});
});

module.exports = router;
