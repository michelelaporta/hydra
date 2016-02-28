var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hydra');

var db = mongoose.connection;

db.on('error', console.error);

db.once('open', function() {
  // Create your schemas and models here.
	console.log('mongo connection successfully opened');
});


// register model
var
	light = require('../model/light'),
	meteo = require('../model/meteo'),
	meter = require('../model/meter'),
	planner = require('../model/planner'),
	preferences = require('../model/preferences'),
	water = require('../model/water'),
	water2 = require('../model/water2');
;

exports.create = function create(collection,data,callback)
{
	mongoose.model(collection).create(data, function (err, data) {
          if (err) {
        	  console.log('There was a problem adding '+collection+' value '+value+' to mongo.Error ' + err);
        	  return callback(err,data);
          } else {
        	  return callback(null,data);
          }
    });	
}

exports.findAll = function findAll(collection,callback)
{
	var m = mongoose.model(collection);
	var s = m.schema;
	
	var T = mongoose.model(collection, s);
	var t = new T({});

	t.findAll(function (err, data) {
		if (err) {
      	  console.log('There was a problem retrieve data for '+collection+' from mongo.Error ' + err);
      	  if( Object.prototype.toString.call(data) === '[object Array]' ) {
      		console.log('GOT ARRAY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><');
      	  }
      	  return callback(err,data);
        } else {
      	  return callback(null,data);
        }
	});

}

