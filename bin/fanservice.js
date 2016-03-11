if(process.arch === 'arm')var gpio = require("pi-gpio");
var moment = require("moment");
var config = require('./config');
var pin = parseInt(config.fansPin);

var fs = require('fs');
var now = moment();
var fs = require("fs");

exports.start = function start(){

	console.log('start fans service@' + now.format());
	
	if(process.arch === 'arm'){
		gpio.open(pin,'input',function(err) {
			if(err) console.log(err);
			console.log('pin fans opened');
		});	
	}
	
	var cron = require('node-schedule');
	
	cron.scheduleJob('* * * * *', function() {
		if(process.arch === 'arm'){
			var result = isOn();
			if(result){
				gpio.setDirection(pin,'output', function(err, value) {
				    if(err) console.log(err);
				    console.log('scheduled turn fan on@' + moment().format());
				});
			}else{
				gpio.setDirection(pin,'input', function(err, value) {
				    if(err) console.log(err);
				    console.log('scheduled turn fan off@' + moment().format());
				});
			}
		}else{
			// x86-x64
			var result = isOn();
			if(result){
			    console.log('scheduled turn fan on@' + moment().format());
			}else{
			    console.log('scheduled turn fan off@' + moment().format());
			}
		}
	});

}

exports.stop = function stop()
{
	if(process.arch === 'arm')
		gpio.close(pin, function() {
			console.log('closed fans pin ' + pin);
		});
	console.log('stop()');
		
}

function isOn()
{
	if(process.arch === 'arm'){
		fs.readFile("/sys/class/gpio/gpio22/direction", "utf8", function(err, value) {
			if(err){
				console.log(err);
				return false;
			}
			var s = (value.trim() === 'out') ? true : false;
			console.log('fans ON:'+ s);
			return s;			
		});
	}else{
		return getRandom();
	}
}

module.exports.isOn = isOn;

function getRandom() {
	return Math.random()<.5; // Readable, succint
}