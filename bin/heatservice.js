if(process.arch === 'arm')var gpio = require("pi-gpio");
var PID = require('awesome-pid');
var moment = require("moment");
var config = require('../bin/config');
var pin = parseInt(config.fansPin);
var cron = require('node-schedule');
var fs = require('fs');
var now = moment();
var lastT,lastH;
var targetT = 22.00;
var airExchangeNumber= config.airExchangeNumber;
var  flowCapacity = config.flowCapacity;

var targetValue = config.targetTemperature;

var options = {
  kp: 500,
  ki: 200,
  kd: 0,
  dt: 1000,  // milliseconds
  initial: targetValue,
  target: targetValue,
  u_bound: 1,
  l_bound: -1
}

var tempPID;

exports.start = function start(){
	console.log('start heat service@ ' + now.format() );
	if(process.arch === 'arm'){
		gpio.open(pin,'input',function(err) {
			if(err)throw err;
			console.log('opened fan pin:'+pin);
		});	
	}
}

exports.monitor = function monitor(temperature,humidity){
	var currentValue ;
	if(process.arch === 'arm')
		currentValue = temperature;
	else
		currentValue = getRandom(18, 25).toFixed(2);
		
	if(!tempPID)
		tempPID = new PID(options);

	tempPID.startLoop();

	// Will be emitted every dt milliseconds
	tempPID.on("output", function(output) {
	  currentValue += parseInt(output);
	  var val = parseInt(currentValue);
	  
	  this.setInput(currentValue);

	  if (val === targetValue ) {
		  //console.log('temp ok');
		  internalOff();
	  }else if(val > targetValue ){
		  //console.log('temperature up on() currentValue:' + currentValue+ ' val:'+val);
		  internalOn();
		  
	  }else if(val > targetValue ){
		  //console.log('temperature down off() currentValue:' + currentValue + ' val:'+val);
		  internalOff();
	  }
	  tempPID.stopLoop();
	});	
	
}

exports.stop = function stop()
{
	if(process.arch === 'arm'){
		gpio.close(pin, function() {
			console.log('closed fans pin ' + pin);
		});
		if(tempPID)
			tempPID.stopLoop();
	}
	console.log('heatService stop()');
}

exports.on = function on()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('heatService on() ' + moment().format());
}

function internalOn()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'output', function(err, value) {
			if(err)throw err;
		});
	console.log('heatService internalOn() ' + moment().format());
}

exports.off = function off()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('heatService off() ' + moment().format());
}

function internalOff()
{
	if(process.arch === 'arm')
		gpio.setDirection(pin,'input', function(err, value) {
			if(err)throw err;
		});
	console.log('heatService internalOff() ' + moment().format());
}

exports.isOn = function isOn(callback)
{
	if(process.arch === 'arm')
		fs.readFile("/sys/class/gpio/gpio22/direction", "utf8", function(err, value) {
			if(err){
				console.log(err);
				return callback(err,null);
			}
			//console.log('fans isOn value:'+ value);
			var s = (value.trim() === 'out') ? true : false;
			console.log('fans ON:'+ s);
			return callback(null,s);
		});
	else
		fs.readFile("/sys/devices/virtual/thermal/thermal_zone0/temp", "utf8", function(err, value) {
			if(err) console.log(err);
			console.log(value);
			return value;
		});
}

function getRandom(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}


