if(process.arch === 'arm')var gpio = require("pi-gpio");
var moment = require("moment");
var config = require('./config');
var pin = parseInt(config.lightsPin);

var fs = require('fs');
var now = moment();
var fs = require("fs");
var on = moment({
	hour : config.lightsOn.hour,
	minute : config.lightsOn.minute
});
var off = moment({
	hour : config.lightsOff.hour,
	minute : config.lightsOff.minute
});


exports.start = function start(){

	console.log('start light service@' + now.format() + ' ON@' + on.hour() + ':' + on.minute()+ ' OFF@' + off.hour() + ':' + off.minute() + " diff:"+(on.diff(now) < 0));
	
	if(process.arch === 'arm')
		gpio.open(pin,'input',function(err) {
			
			if(err) console.log(err);
			
			if (on.diff(now) < 0) {
				gpio.setDirection(pin,'output', function(err, value) {
					if(err) console.log(err);
					console.log('turn lights ON');
				});
	
			} else {
				gpio.setDirection(pin,'input', function(err, value) {
					if(err) console.log(err);
					console.log('turn lights OFF');
				});
			}
		});	
	
	var cron = require('node-schedule');
	
	//+---------------- minute (0 - 59)
	//|  +------------- hour (0 - 23)
	//|  |  +---------- day of month (1 - 31)
	//|  |  |  +------- month (1 - 12)
	//|  |  |  |  +---- day of week (0 - 6) (Sunday=0 or 7)
	//|  |  |  |  |
	//t *  *  *  *  *  command to be executed
	
	cron.scheduleJob(on.minute() + '/' + on.hour() + ' * * * *', function() {
		if(process.arch === 'arm')
			gpio.setDirection(pin,'output', function(err, value) {
			    if(err) console.log(err);
			    console.log('scheduled light on@' + on.format());
			});
	});

	cron.scheduleJob(off.minute() + '/' + off.hour() + ' * * * *', function() {
		if(process.arch === 'arm')
			gpio.setDirection(pin,'input', function(err, value) {
			    if(err)	console.log(err);
			    console.log('scheduled off@' + off.format());

			});
	});	
}

exports.stop = function stop()
{
	if(process.arch === 'arm')
		gpio.close(pin, function() {
			console.log('closed lights pin ' + pin);
		});
	console.log('stop()');
		
}

exports.on = function on()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('lights on()');
}

exports.off = function off()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('lights off()');
}


exports.isOn = function isOn(callback)
{
	if(process.arch === 'arm'){
		fs.readFile("/sys/class/gpio/gpio18/direction", "utf8", function(err, value) {
			if(err){
				console.log(err);
				return callback(err,null);
			}
			var s = (value.trim() === 'out') ? true : false;
			console.log('lights ON:'+ s);
			return callback(null,s);			
		});
	}
	else{
		return callback(null,!(Math.random()+.5|0));
//		fs.readFile("/sys/devices/virtual/thermal/thermal_zone0/temp", "utf8", function(err, value) {
//			if(err){
//				console.log(err);
//				return callback(err,null);
//			}
//			console.log('light isOn '+ value);
//			return callback(null,!(Math.random()+.5|0));
//		});
	}
}

