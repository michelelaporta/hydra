var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/hydra');
//var db = mongoose.connection;
var db = mongoose.createConnection('mongodb://localhost/hydra');

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
	cpu = require('../model/cpu'),
	water = require('../model/water'),
	water1 = require('../model/water1'),
	water2 = require('../model/water2'),
	water3 = require('../model/water3');
//	conf = require('../model/conf');
	//userInfo = require('../model/userInfo');


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
      		console.log('GOT ARRAY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      	  }
      	  return callback(err,data);
        } else {
      	  return callback(null,data);
        }
	});
}

exports.getAllChannels = function getAllChannels() {
    var callback = function() {
        return function(error, data) {
            if(error) {
                console.log("Error: " + error);
            }
            //console.log("Boards from Server (fct): " + data);
        }
    };

    return conf.find({}, callback());
};

/**
exports.findUser = function findUser(collection,username,password,callback)
{
	var m = mongoose.model(collection);
	var s = m.schema;
	
	var T = mongoose.model(collection, s);
	var t = new T({});

	t.findUser(username,password, function (err, data) {
        if (err) {
      	  console.log('mongo findUser error ' + err);
      	  return callback(err,data);
        } else {
        	  console.log('mongo found findUser <' + data+'>');
      	  return callback(null,data);
        }
	});	
}*/