var express = require('express');
var router = express.Router();

/* GET index page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Hydra Home' });
//});

//console.log('ensureLoggedIn -> ' + require('connect-ensure-login').ensureLoggedIn());
//router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
//	//console.log('req.user ' +req.user)
//	res.render('index', { title: 'Hydra Home' });
//});
router.get('/', function(req, res) {
	console.log('req.user ' +req.user);
	console.log('req.isAuthenticated ' + req.isAuthenticated());
	//console.log(require('connect-ensure-login').ensureLoggedIn());
	res.render('index', { title: 'Hydra Home' });
});

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render('index/partials/' + name, {title : 'Hydra Index'});
});

module.exports = router;
