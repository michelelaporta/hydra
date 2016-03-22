var arm = process.arch === 'arm';
var moment = require("moment");

var now = moment();

var fs = require("fs");
var sys = require('util');
var exec = require('child_process').exec;
var child;

exports.emitInternalTemperature = function emitInternalTemperature(socket) {
	setInterval(function() {
		if (arm) {

			child = exec("cat /sys/class/thermal/thermal_zone0/temp", function(
					error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				} else {
					// You must send time (X axis) and a temperature value (Y axis) 
					var date = new Date().getTime();
					var temp = parseFloat(stdout) / 1000;
					//console.log('cpuData ' + temp + ' on socket ' + socket.id);
					socket.emit('cpuData', date, temp);
				}
			});
		} else {
			fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8',
					function(err, value) {
						if (err) {
							console.log('exec error: ' + error);
						} else {
							var date = new Date().getTime();
							var temp = parseFloat(value.trim()) / 1000;
							//console.log('cpuData ' + temp + ' on socket ' + socket.id);
							socket.emit('cpuData', date, temp);
						}
					});
		}
	}, 10000);
}

function readInternalTemperature(callback) {

	if (arm) {

		child = exec("cat /sys/class/thermal/thermal_zone0/temp", function(
				error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
			} else {
				// You must send time (X axis) and a temperature value (Y axis) 
				var date = new Date().getTime();
				var temp = parseFloat(stdout) / 1000;
				console.log('temp ' + temp);
				//socket.emit('temperatureUpdate', date, temp); 
			}
		});
	} else {
		fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8', function(
				err, value) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, value.trim() / 1000);
		});
	}
}

//readInternalTemperature(function(err,resp){
//	if(err){ 
//		console.log(err);
//	}else{
//		console.log('temp '+resp+' C°');
//	}
//});

