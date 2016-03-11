var express = require('express');
var router = express.Router();

var session;

/* GET home page. */
router.get('/', function(req, res, next) {
	session=req.session;
  res.render('index', { title: 'Hydra Home' });
});

module.exports = router;
