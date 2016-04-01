var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hydra');

//var confSchema = mongoose.Schema({ firstname: 'string', lastname: 'string', age: 'number' });
//var Contact = mongoose.model('Conf', confSchema);

var Schema = mongoose.Schema;

var Conf = new Schema({
	firstname: String,
	lastname: String,
	age: Number
}, {collection: 'conf'});

var Conf = mongoose.model('conf',Conf);

//console.log('Model conf ' + Conf);


var express = require('express');
var router = express.Router();

// GET
router.get('/conf', function(req, res, next) {
	//console.log('/api/conf array INVOKED');
	Conf.find({}, function(err, obj) {
		if(err) console.log(err);
		console.log('findAll ' + obj);
		res.json(obj);
	});	
});

// GET
router.get('/conf/:id', function(req, res, next) {
	//console.log('/api/conf id '+req.params.id+' INVOKED');
	Conf.findOne({ _id: req.params.id }, function(err, obj) {
		if(err) console.log(err);
		console.log('findOne ' + obj);
		res.json(obj);
	});	
});

// POST
router.post('/conf', function(req, res, next) {
	//console.log('conf post ' +req.body);
	var contact = new Conf(req.body);
	contact.save();
	res.json(req.body);
});

// PUT
router.put('/conf/:id', function(req, res, next) {
	Conf.findByIdAndUpdate(req.params.id, {
		$set: { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age }
	}, { upsert: true },
	function(err, obj) {
		return res.json(true);
	});
});

// DELETE
router.delete('/conf/:id', function(req, res, next) {
	Conf.remove({ _id: req.params.id }, function(err) {
		res.json(true);
	});
});

module.exports = router;

