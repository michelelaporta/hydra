if(process.arch === 'arm')var gpio = require("pi-gpio");

var EventEmitter = require('events').EventEmitter;

function TempMonitor() {
	
	var emitter = new EventEmitter();
	var msg = 'hello ';
	
	function print(message) {
		msg += message;
		emitter.emit("rawData", msg);
	}
	
	function _startPoll(targetTemp, callback) {
		try{
			callback(targetTemp,true);
		} catch(e) {
			callback(null,true);
		}
	}

	function startTransfer() {
		_startPoll('targetTemp', function(targetTemp,cb) {
			if(cb){
				emitter.emit("rawData", targetTemp);
			}else{
				emitter.emit("error", 'there was an err');
			}
		});
	}

	function getEmitter() {
		return emitter;
	}

	return {
		print: 		print,
		startTransfer: 	startTransfer,
		data: 			getEmitter
	};
	
}

module.exports = TempMonitor();