#!/usr/bin/env node

var app = require('../app2');
var mongo = require('./mongo');
var fs = require('fs');
//var debug = require('debug')('express-node-mongo-skeleton:server');
var http = require('http');
var proc;
var https = require('https');
var config = require('./config');
var moment = require("moment");

var arch = process.arch;
console.log('Arch:' + arch);

var arm = process.arch === 'arm';

var sockets = {};

/**
 * Get port from environment and store in Express.
 */
//var port = normalizePort(process.env.PORT || '4910');
var port = '4000';
app.set('port', port);
/**
 * TODO Get host from environment and store in Express.
 */
app.set('domain', '0.0.0.0');

//https key/cert
var options;
if(arm){
	options = {
	  key: fs.readFileSync('/home/pi/hydra/file.pem'),
	  cert: fs.readFileSync('/home/pi/hydra/file.crt')
	};
}else{
	options = {
	  key: fs.readFileSync('../file.pem'),
	  cert: fs.readFileSync('../file.crt')
	};
}

//var serverHttps = https.createServer(options,app).listen('5000');
var serverHttp = http.createServer(app).listen(port);
/**
* Listen on provided port, on all network interfaces.
*/

serverHttp.on('error', onError);
serverHttp.on('listening', onListening);

var io = require('socket.io').listen(serverHttp);

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
	var addr = serverHttp.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

io.sockets.on('connection', function(socket) {
	sockets[socket.id] = socket;
	console.log('connection ' + socket.id);
	
	// defined data model
	
	//socket.emit('initialization', {interval:1, limit:1});

	socket.on('disconnect', function(socket) {
		delete sockets[socket.id];
		console.log('disconnection ' + socket);
	});
});

setInterval(function updateRandom() {
	//console.log('random');
	io.sockets.emit('water1Data', {water1: getRandom(10, 15).toFixed(2)}); 
	io.sockets.emit('water2Data', {water2: getRandom(10, 15).toFixed(2)}); 
	io.sockets.emit('water3Data', {water3: getRandom(10, 15).toFixed(2)}); 
	io.sockets.emit('water3Data', {water3: getRandom(10, 15).toFixed(2)}); 
	io.sockets.emit('water3Data', {water3: getRandom(10, 15).toFixed(2)}); 

	io.sockets.emit('lightData', {light: getRandom(5000, 50000).toFixed(2)}); 
	io.sockets.emit('cpuData', {cpu: getRandom(10, 15).toFixed(2)}); 

//	mongo.create('water1',{water1: getRandom(10, 15).toFixed(2)},function(err,response){
//		if(err) console.log(err);
//		
//
//	});
}, 5000);

process.on('SIGTERM', function() {
	console.log("\nShutdown..");
//	if (arm) {
//		lightservice.stop();
//		heatservice.stop();
//		fanservice.stop();
//	}
	console.log("Exiting...");
	process.exit();
});


function getRandom(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}