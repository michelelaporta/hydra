var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('about', { title: 'Hydra About', what: 'hydroponics green house management software', jquery:true, socket:true })
});

module.exports = router;

