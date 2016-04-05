var moment = require("moment");
var fs = require("fs");
var arm = process.arch === 'arm';
if(arm)
	var gpio = require("pi-gpio");
var now = moment();
var currentChannel;
var isOpen;

/** Constructor */
function Channel(channel) {
  this.currentChannel = channel;
}

// class methods

Channel.prototype.getChannel = function() {
	return this.currentChannel;
};

var cron = require('node-schedule');

//class methods
Channel.prototype.open = function() {
	if(arm){
		gpio.open(this.currentChannel.pin, "input", function(err) {     // Open pin 16 for output
		    if(err)
		    	console.log(err);
		    this.isOpen = true;
		});
	}else{
	    this.isOpen = true;
	}
	console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' open channel[' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio+']');
};

Channel.prototype.close = function (){
	if(arm){
		gpio.close(this.currentChannel.pin, function() {
			console.log('closed pin');
		    this.isOpen = false;
		});
	}else{
	    this.isOpen = false;
	}
	console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' close channel[' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio+']');
}

Channel.prototype.on = function() {
	if(this.currentChannel.enable){
		if(arm)
			gpio.setDirection(this.currentChannel.pin,'output', function(err, value) {
				if(err)throw err;
			});
		console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' on channel[' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio+']');
	}
};

Channel.prototype.off = function() {
	if(this.currentChannel.enable){
		if(arm)
			gpio.setDirection(this.currentChannel.pin,'input', function(err, value) {
				if(err)throw err;
			});
		console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' off channel[' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio+']');
	}
};

Channel.prototype.isOn = function() {
	if(this.currentChannel.enable){
		if(arm){
			fs.readFile('/sys/class/gpio/gpio'+this.currentChannel.gpio+'/direction', 'utf8', function(err, value) {
				if(err){
					console.log(err);
				}
				var s = (value.trim() === 'out') ? true : false;
				console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' isON ' + s + ' channel[' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio);
				return s;			
			});
		}
		else{
			return this.currentChannel.enable;
		}
	}	
};

Channel.prototype.isOpen = function() {
	console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' isOpen ' + this.isOpen + ' channel[name=' + this.currentChannel.name + '('+this.currentChannel.description+')'+ ',enable:' + this.currentChannel.enable + ',pin:' + this.currentChannel.pin + ',gpio:' + this.currentChannel.gpio);

	return this.isOpen;
};

Channel.prototype.monitor = function(data) {
	if(this.currentChannel.enable){
		if(this.currentChannel.target.length > 0){
			var currentTemp = parseInt(data.temperature, 10).toFixed(0);
			var targetTemp = parseInt(this.currentChannel.target, 10).toFixed(0);
			
			if (currentTemp == targetTemp ) {
				  console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') +' channel[name=' + this.currentChannel.name + '('+this.currentChannel.description+')'+' OK data['+currentTemp+'] target['+targetTemp+']');
				  this.on();
			}
			else if(currentTemp > targetTemp ){
			  console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') +' channel[name=' + this.currentChannel.name +'('+this.currentChannel.description+')'+' UP data['+currentTemp+'] target['+targetTemp+']');
			  this.off();
			}
			else if(currentTemp < targetTemp ){
			  console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') +' channel[name=' + this.currentChannel.name +'('+this.currentChannel.description+')'+' DOWN data['+currentTemp+'] target['+targetTemp+']');
			  this.on();
			}
		}
	}	
};

module.exports = Channel;

