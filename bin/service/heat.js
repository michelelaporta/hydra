require('events').EventEmitter.prototype._maxListeners = 0;

var moment = require("moment");
var config = require('../config');
var cron = require('node-schedule');
var fs = require('fs');

var pin = parseInt(config.relay3.pin);
var pingpio = parseInt(config.relay3.gpio);
var targetTemperature = parseInt(config.relay3.targetTemperature);

var arm = process.arch === 'arm';
if(arm)
	var gpio = require("pi-gpio");

var now = moment();

var lastT;

exports.start = function start(){
	console.log('start heat[pin='+pin+',gpio='+pingpio+']\tservice@ ' + now.format() );
	if(arm){
		gpio.open(pin,'input',function(err) {
			if(err)throw err;
		});	
	}
}

exports.monitor = function monitor(temperature){
	var currentTemperature ;
	
	if(arm){
		currentTemperature = temperature;
	}else{
		currentTemperature = temperature;
	}

	if (currentTemperature === targetTemperature ) {
	  console.log('heat service OK currentTemperature['+currentTemperature+'] targetTemperature['+targetTemperature+']');
	  internalOn();
	}else if(currentTemperature > targetTemperature ){
	  console.log('heat service UP currentTemperature['+currentTemperature+'] targetTemperature['+targetTemperature+']');
	  internalOff();
	}else if(currentTemperature < targetTemperature ){
	  console.log('heat service DOWN currentTemperature['+currentTemperature+'] targetTemperature['+targetTemperature+']');
	  internalOn();
	}
}

exports.stop = function stop()
{
	if(arm){
		gpio.close(pin, function() {
			console.log('closed heat pin ' + pin);
		});
	}
	console.log('heat service stop()');
}

exports.on = function on()
{
	if(arm)
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('heat service on@' + moment().format());
}

function internalOn()
{
	if(arm)
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('heatService internalOn@' + moment().format());
}

exports.off = function off()
{
	if(arm)
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('heat service off@' + moment().format());
}

function internalOff()
{
	if(arm)
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('heat service internalOff@' + moment().format());
}

exports.isOn = function isOn(callback)
{
	if(arm)
		fs.readFile('/sys/class/gpio/gpio'+pingpio+'/direction', 'utf8', function(err, value) {
			if(err){
				console.log(err);
				return callback(err,null);
			}
			//console.log('fans isOn value:'+ value);
			var s = (value.trim() === 'out') ? true : false;
			console.log('heat isOn('+ s +') @' + moment().format());
			return callback(null,s);
		});
	else
		return callback(null,!(Math.random()+.5|0));
}

function getRandom(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}


