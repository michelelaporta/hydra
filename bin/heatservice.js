require('events').EventEmitter.prototype._maxListeners = 0;

if(process.arch === 'arm')var gpio = require("pi-gpio");
var PID = require('awesome-pid');
var moment = require("moment");
var config = require('../bin/config');
var pin = parseInt(config.fansPin);
var cron = require('node-schedule');
var fs = require('fs');
var now = moment();
var lastT,lastH;
var airExchangeNumber= config.airExchangeNumber;
var  flowCapacity = config.flowCapacity;

var targetTemperature = config.targetTemperature;

var targetHumidity = config.targetHumidity;

var tempOptions = {
  kp: 500,
  ki: 200,
  kd: 0,
  dt: 10000,  // milliseconds
  initial: targetTemperature,
  target: targetTemperature,
  u_bound: 1,
  l_bound: -1
}

var humidityOptions = {
		  kp: 500,
		  ki: 200,
		  kd: 0,
		  dt: 10000,  // milliseconds
		  initial: targetHumidity,
		  target: targetHumidity,
		  u_bound: 1,
		  l_bound: -1
		}

var tempPID;
var humidityPID;

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
	var currentTemperature ;
	var currentHumidity;
	
	if(process.arch === 'arm'){
		currentTemperature = temperature;
		currentHumidity = humidity;
	}else{
		currentTemperature = getRandom(18, 25).toFixed(2);
		currentHumidity = getRandom(40, 80).toFixed(2);
	}
	if(!tempPID)
		tempPID = new PID(tempOptions);

	tempOptions.initial = currentTemperature;
	
	tempPID.startLoop();

	// Will be emitted every dt milliseconds
	tempPID.on("output", function(output) {
		currentTemperature += parseInt(output);
	  var val = parseInt(currentTemperature);
	  
	  this.setInput(currentTemperature);

	  if (val === targetTemperature ) {
		  //console.log('temp ok');
		  console.log('OK currentTemperature['+val+'] targetTemperature['+targetTemperature+']');
		  internalOn();
	  }else if(val > targetTemperature ){
		  console.log('UP currentTemperature['+val+'] targetTemperature['+targetTemperature+']');
		  internalOff();
	  }else if(val < targetTemperature ){
		  //console.log('temperature down off() currentValue:' + currentValue + ' val:'+val);
		  console.log('DOWN currentTemperature['+val+'] targetTemperature['+targetTemperature+']');
		  internalOn();
	  }
	  tempPID.stopLoop();
	});	
	
	if(!humidityPID)
		humidityPID = new PID(humidityOptions);

	humidityOptions.initial = currentHumidity;
	
	humidityPID.startLoop();

	// Will be emitted every dt milliseconds
	humidityPID.on("output", function(output) {
	  currentHumidity += parseInt(output);
	  var val = parseInt(currentHumidity);
	  
	  this.setInput(currentHumidity);

	  if (val === targetHumidity ) {
		  console.log('OK currentHumidity['+val+'] targetHumidity['+targetHumidity+']');
		  internalOff();
	  }else if(val > targetHumidity ){
		  //console.log('temperature up on() currentValue:' + currentValue+ ' val:'+val);
		  console.log('UP currentHumidity['+val+'] targetHumidity['+targetHumidity+']');
		  internalOn();
	  }else if(val < targetHumidity ){
		  //console.log('temperature down off() currentValue:' + currentValue + ' val:'+val);
		  console.log('DOWN currentHumidity['+val+'] targetHumidity['+targetHumidity+']');
		  internalOff();
	  }
	  humidityPID.stopLoop();
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
		return callback(null,!(Math.random()+.5|0));
//		fs.readFile("/sys/devices/virtual/thermal/thermal_zone0/temp", "utf8", function(err, value) {
//			if(err) console.log(err);
//			console.log(value);
//			return callback(null,!(Math.random()+.5|0));
//		});
}

function getRandom(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}


