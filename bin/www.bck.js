#!/usr/bin/env node

var app = require('../app');
var mongo = require('./mongo');
var fs = require('fs');
var http = require('http');
var https = require('https');
var config = require('./config');
var moment = require("moment");
var arm = process.arch === 'arm';
var cron = require('node-schedule');
var spawn = require('child_process').spawn;

var arch = process.arch;
var proc;

//use all_d to hold config.limit number of data sets for initial connections
var limit=config.limit, interval=config.interval, all_d=[];
var meteoHistory = [];

var bh1750Enable = config.bh1750Enable;
var probeSensorEnable = config.probeSensorEnable;
var tprobeSensor;
if(probeSensorEnable)
	tprobeSensor = require('./ds18x20');

var lightsStatus = false;
var fansStatus = false;

var waterSensor = 0;
var now = new Date();
var BH1750;
var light;

var lightservice = require('./service/light');
lightservice.start();

var heatservice = require('./service/heat');
heatservice.start();

var fanservice = require('./service/fan');
fanservice.start();


/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '4443');

app.set('port', port);
app.set('domain', '0.0.0.0');

/**
 * https key/cert
 */
var options;
if(arm){
	options = {
	  key: fs.readFileSync('/home/pi/hydra/file.pem'),
	  cert: fs.readFileSync('/home/pi/hydra/file.crt')
	};
}else{
	options = {
	  key: fs.readFileSync('./file.pem'),
	  cert: fs.readFileSync('./file.crt')
	};
}

/**
 * Create HTTP server.
 */
var serverHttps = https.createServer(options,app).listen(port);

/**
 * Listen on provided port, on all network interfaces.
 */

serverHttps.on('error', onError);
serverHttps.on('listening', onListening);

var io = require('socket.io').listen(serverHttps);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = serverHttps.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

if(arm){
	
	if(bh1750Enable){
		// initialize light sensor
		BH1750 = require('./bh1750');
		if(!light)
			light = new BH1750();
	}
	
	var sensorLib = require('node-dht-sensor');

	var sensor = {
		initialize : function() {
			var dhtSensor = sensorLib.initialize(config.dhtVersion, config.dhtPin);
			console.log('initializing DHT:' + config.dhtVersion + ' sensor on pin:'	+ config.dhtPin);
			return dhtSensor;
		},
		read : function() {
			var readout = sensorLib.read();
			var temperatureData = readout.temperature.toFixed(2);
			var humidityData = readout.humidity.toFixed(2);
			console.log('DHT TEMP: ' +temperatureData + ' HUMD: ' +humidityData + ' @ ' + moment().format());
			
			var meteoData = {
				temperature : temperatureData,
				humidity : humidityData
			};

			mongo.create('meteo',meteoData,function(err,response){
				if(err) console.log(err);
				io.sockets.emit('meteoData', response); 
			});
			
			setTimeout(function() {
				sensor.read();
			}, config.dhtTimeout);
		}
	};

	if (sensor.initialize()) {
		sensor.read();
	} else {
		console.warn('Failed to initialize sensor');
	}
}

var sockets = {};

var cpuMonitor = require('./service/cpu');
cpuMonitor.emitInternalTemperature(io.sockets);

io.sockets.on('connection', function(socket) {
	
	sockets[socket.id] = socket;
	console.log('Client connected ' + socket.id);
	
	socket.emit('initialization', {interval:interval, limit:limit});
	
	socket.on('disconnect', function() {
		delete sockets[socket.id];

		// no more sockets, kill the stream
//		if (Object.keys(sockets).length == 0) {
//			app.set('watchingFile', false);
//			if (proc)
//				proc.kill();
//			fs.unwatchFile('./stream/image_stream.jpg');
//		}
	});
	
	socket.on('lights', function(d){
		console.log('got light command  ' + d.status);
		if(arm){
			var gpio = require("pi-gpio");
			if(d.status){
				lightservice.on();
			}else{
				lightservice.off();
			}
		}
	});
	
	socket.on('fans', function(d){
		console.log('got fan command ' + d.status);
		if(arm){
			var gpio = require("pi-gpio");
			if(d.status){
				fanservice.on();
			}else{
				fanservice.off();
			}					
		}
	});
	
	socket.on('channel', function(d){
		console.log('got channel command ' + d.status);
		if(arm){
			var gpio = require("pi-gpio");
			if(d.status){
				fanservice.on();
			}else{
				fanservice.off();
			}					
		}
	});
	
//	socket.on('takeSnapshot', function(){
//		console.log('takeSnapshot ' );
//		if(arm){
//								
//		}else{
//			var args = ["-y","-f","video4linux2","-i", "/dev/video0","-vframes","1","./stream/image_stream.jpg"];
//			proc = spawn('ffmpeg', args);
//		}
//		
//		app.set('watchingFile', true);
//
//		fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
//		  io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
//		})
//	});
//	
//	socket.on('startStream', function() {
//		startStreaming(io);
//	});	
});


if(arm){
	
	// +---------------- minute (0 - 59)
	// |  +------------- hour (0 - 23)
	// |  |  +---------- day of month (1 - 31)
	// |  |  |  +------- month (1 - 12)
	// |  |  |  |  +---- day of week (0 - 6) (Sunday=0 or 7)
	// |  |  |  |  |
	//t *  *  *  *  *  command to be executed
	cron.scheduleJob('*/1 * * * *', function(){
	
		if(lightservice){
			lightservice.isOn(function(err,resp){
				if(err){ 
					console.log(err);
				}else{
					lightsStatus = resp;
					io.sockets.emit('initLights', {lights:lightsStatus});
				}
			});
		}
		
		if(fanservice){
			fanservice.isOn(function(err,resp){
				if(err){ 
					console.log(err);
				}else{
					fanStatus = resp;
					io.sockets.emit('initFans', {fans:fanStatus});
				}
			});
		}
		
		if(probeSensorEnable){
			// TODO use config.ds18x20 address 
//			var value = tprobeSensor.probe('28-000005cff2dd');
//			var waterData = {water: ''+value};
//			mongo.create('water',waterData,function(err,response){
//				if(err) console.log(err);
//	    		io.sockets.emit('waterData', response); 
//			});
			
			value = tprobeSensor.probe('28-000005e66282');
			waterData = {water: ''+value};
			mongo.create('water',waterData,function(err,response){
				if(err) console.log(err);
				//console.log('notify heat service with value ' + value);
				if(heatservice)
					heatservice.monitor(value);
			    //console.log('water2Data response ' + response);
	    		io.sockets.emit('waterData', response); 
			});
		}
		
		if(bh1750Enable){
			light.readLight(function(value){
			    var lightData = {light:value};
			    mongo.create('light',lightData,function(err,response){
					if(err) console.log(err);
				    //console.log('lightData response ' + response);
				    io.sockets.emit('lightData', response); 
				});
			});
		}
	});
	
}else{

	setInterval(function updateRandom() {
		mongo.create('water',{water: getRandom(15, 24).toFixed(2)},function(err,response){
			if(err) console.log(err);
			//console.log('emit water1Data ' +response);
			io.sockets.emit('waterData', response); 

		});
		
		var meteoData = {
			temperature : getRandom(21, 27).toFixed(2),
			humidity : getRandom(40, 80).toFixed(2)
		};

		mongo.create('meteo',meteoData,function(err,response){
			if(err) console.log(err);
			io.sockets.emit('meteoData', response); 
			
		});
		mongo.create('cpuData',{cpuData: getRandom(40,50).toFixed(2)},function(err,response){
			if(err) console.log(err);
			io.sockets.emit('cpuData', response); 
		});	
	}, config.dhtTimeout);
}

process.on('SIGTERM', function() {
    console.log("\nShutdown..");
    if(arm)
	{
    	lightservice.stop();
    	heatservice.stop();
    	fanservice.stop();
	}
    console.log("Exiting...");
    process.exit();
});


function getRandom(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**WEBCAM STREAMING

function stopStreaming() {
	console.log('stopStreaming CALLED');	
	if (Object.keys(sockets).length == 0) {
		app.set('watchingFile', false);
		if (proc)
			proc.kill();
		fs.unwatchFile('./stream/image_stream.jpg');
	}
}

function startStreaming(io) {
  console.log('startStreaming CALLED');	
  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }
  if(arm)
  {
   var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
   proc = spawn('raspistill', args);
  }
  else
  {
	var args = ["-y","-f","video4linux2","-i", "/dev/video0","-vframes","1","./stream/image_stream.jpg"];
	proc = spawn('ffmpeg', args);
	//console.log('startStreaming Spawned child pid: ' + proc.pid);
  }

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })
}
*/
