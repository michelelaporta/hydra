var moment = require("moment");
var config = require('../config');
var pin = parseInt(config.relay1.pin);
var pingpio = parseInt(config.relay1.gpio);

var fs = require('fs');
var now = moment();

var arm = process.arch === 'arm';
if(arm)
	var gpio = require("pi-gpio");

var on = moment({
	hour : config.lightsOn.hour,
	minute : config.lightsOn.minute
});

var off = moment({
	hour : config.lightsOff.hour,
	minute : config.lightsOff.minute
});


exports.start = function start(){

	console.log('start light[pin='+pin+',gpio='+pingpio+']\tNOW@' + now.format() + ' ON@' + on.hour() + ':' + on.minute()+ ' OFF@' + off.hour() + ':' + off.minute() + " diff:"+(on.diff(now) < 0));
	
	if(arm){
		gpio.open(pin,'input',function(err) {
			
			if(err) console.log(err);
			
			//if (on.diff(now) < 0) {
			if (now.unix() > on.unix() ) {
				gpio.setDirection(pin,'output', function(err, value) {
					if(err) console.log(err);
					console.log('turn lights ON ' + moment().format());
				});
	
			} else {
				gpio.setDirection(pin,'input', function(err, value) {
					if(err) console.log(err);
					console.log('turn lights OFF ' + moment().format());
				});
			}
		});	
	}else{
		// not arm
		if (on.diff(now) < 0) {
			console.log('turn lights ON');
		}else {
			console.log('turn lights OFF');
		}
	}
	var cron = require('node-schedule');
	
	cron.scheduleJob(on.minute() + ' ' + on.hour() + ' * * * ', function() {
		if(arm)
			gpio.setDirection(pin,'output', function(err, value) {
			    if(err) console.log(err);
			});
	    console.log('scheduled light on@' + moment().format());
	});

	cron.scheduleJob(off.minute() + ' ' + off.hour() + ' * * * ', function() {
		if(arm)
			gpio.setDirection(pin,'input', function(err, value) {
			    if(err)	console.log(err);
			});
	    console.log('scheduled light off@' + moment().format());
	});	
}

exports.stop = function stop()
{
	if(arm)
		gpio.close(pin, function() {
			console.log('closed lights pin ' + pin);
		});
	console.log('light service stop()');
		
}

exports.on = function on()
{
	if(arm)
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('light service on()');
}

exports.off = function off()
{
	if(arm)
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('light service off()');
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
			console.log('lights isOn('+ s+')');
			return callback(null,s);			
		});
	}
	else{
		return callback(null,!(Math.random()+.5|0));
	}
}

