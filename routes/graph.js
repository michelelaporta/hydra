var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('graph', { title: 'Hydra Monitor', what: 'temperature humidity', jquery:true, socket:true })
});

module.exports = router;

