var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Hydra Login', what: 'hydroponics green house management software', jquery:true, socket:true })
});

module.exports = router;

