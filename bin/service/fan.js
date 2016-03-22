var moment = require("moment");
var fs = require("fs");
var config = require('../config');
var pin = parseInt(config.relay2.pin);
var pingpio = parseInt(config.relay2.gpio);
var airExchangeNumber = parseInt(config.relay2.airExchangeNumber);
var flowCapacity = parseInt(config.relay2.flowCapacity);
var timeout = parseInt(config.relay2.timeout);
var enable = config.relay2.enable;

var arm = process.arch === 'arm';
if(arm)
	var gpio = require("pi-gpio");

var now = moment();

exports.start = function start(){

	console.log('start fan[pin='+pin+',gpio='+pingpio+']\tservice@' + now.format());
	
	if(arm){
		gpio.open(pin,'input',function(err) {
			if(err) console.log(err);
		});	
	}
	
	var cron = require('node-schedule');
	
	if(enable){
		// even minutes
		cron.scheduleJob('*/2 * * * *', function() {
			if(arm)
				gpio.setDirection(pin,'output', function(err, value) {
				    if(err) console.log(err);
				});
		    console.log('scheduled fan on@' + moment().format());
		});

		// odd minutes
		cron.scheduleJob('1-59/2 * * * *', function() {
			if(arm)
				gpio.setDirection(pin,'input', function(err, value) {
				    if(err)	console.log(err);
				});
		    console.log('scheduled fan off@' + moment().format());
		});	
	}
}

exports.on = function on()
{
	if(arm)
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('fan service on@' + moment().format());
}

exports.off = function off()
{
	if(arm)
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('fan service off@' + moment().format());
}


exports.isOn = function isOn(callback)
{
	if(arm){
		fs.readFile('/sys/class/gpio/gpio'+pingpio+'/direction', 'utf8', function(err, value) {
			if(err){
				console.log(err);
				return callback(err,null);
			}
			var s = (value.trim() === 'out') ? true : false;
			console.log('fan isOn('+ s+') @' + moment().format());
			return callback(null,s);			
		});
	}
	else{
		return callback(null,!(Math.random()+.5|0));
	}
}

exports.stop = function stop()
{
	if(arm)
		gpio.close(pin, function() {
			console.log('closed fan pin ' + pin);
		});
	console.log('fan service stop() @' + moment().format());
}

