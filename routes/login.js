var express = require('express');
var router = express.Router();

var passport = require('passport');
var config = require('../bin/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Hydra Login', what: 'hydroponics green house management software',version:config.version,author:config.author, jquery:true, socket:false })
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login'
  })
);

module.exports = router;

