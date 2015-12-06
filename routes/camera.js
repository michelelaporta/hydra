var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    url = require( "url" );

var express = require('express');
var router = express.Router();
var config = require('../utils/config');

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


router.get('/', function(req, res, next) {
  res.render('camera', { title: 'Hydra Camera', what: 'Live cam',author: 'MLP',version: config.version})
});

module.exports = router;

