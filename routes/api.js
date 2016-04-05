var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hydra');
var Conf = require('../model/conf');
var Conf = mongoose.model('conf',Conf);
var express = require('express');
var router = express.Router();

// GET
router.get('/conf', function(req, res, next) {
	Conf.find({}, function(err, obj) {
		if(err) console.log(err);
		res.json(obj);
	});	
});

// GET
router.get('/conf/:id', function(req, res, next) {
	Conf.findOne({ _id: req.params.id }, function(err, obj) {
		if(err) console.log(err);
		res.json(obj);
	});	
});

// POST
router.post('/conf', function(req, res, next) {
	console.log('save ' +req.body);
	
	var conf = new Conf(req.body);
	conf.save();
	res.json(req.body);
});

// PUT
router.put('/conf/:id', function(req, res, next) {
	//console.log('findByIdAndUpdate ' +req.params.id);
	Conf.findByIdAndUpdate(req.params.id, {
		$set: { name: req.body.name, enable: req.body.enable,gpio: req.body.gpio, pin:req.body.pin, start: req.body.start, stop: req.body.stop, target: req.body.target, rate: req.body.rate }
	}, { upsert: true },
	function(err, obj) {
		return res.json(true);
	});
});

// DELETE
router.delete('/conf/:id', function(req, res, next) {
	//console.log('delete call ' + req.params.id);
	Conf.destroy({ _id: req.params.id 
		}, function(err,conf) {
		//res.json(true);
		if (err)
            res.send(err);

        // get and return all the conf after you remove one
		Conf.find(function(err, confs) {
            if (err)
                res.send(err)
            res.json(confs);
        });			
	});
});

module.exports = router;
