/**
 * Creates the Socket.IO server, and handles GPIO events. Should be used as a module. See example-server.js file.
 * @param {Object} config Configuration object. Requires the HttpServer.port property.
 * @constructor
 */
var JSGPIOServer = function (config) {
    // Store configuration for later use.
    this.config = config;

    // Create server.
    this.createServer();

    // Prepare GPIO handler.
    this.prepareGPIOHandler();
}

/**
 * Creates the HTTP server.
 * @function
 */
JSGPIOServer.prototype.createServer = function() {

	this.express = require('express');
	this.app = this.express();
	
	this.path = require('path');
	this.app.set('port', this.config.bindPort); 
	this.app.set('domain', this.config.bindAddress);
	this.app.set('views', this.path.join(__dirname, 'views'));
	this.app.set('view engine', 'jade');
	this.app.use(this.express.bodyParser()); // <-- add
	this.app.use(this.express.static(this.path.join(__dirname, 'public')))
	
//	this.app.configure('development', function(){
//	  this.app.use(this.express.errorHandler({ dumpExceptions: true, showStack: true })); 
//	});
//	this.app.configure('production', function(){
//		this.app.use(this.express.errorHandler()); 
//	});	

	this.httpServer = require('http').createServer(this.app);

	this.socketIo = require('socket.io').listen(this.httpServer);

	this.routes = require('./routes');
    this.about = require('./routes/about'),
    this.graph = require('./routes/graph'),
    // Routes
    this.app.get('/', this.routes.index);
    this.app.get('/about', this.about.list);
    this.app.get('/graph', this.graph.show);

//    this.app.get('/',function(req, res){
//	  res.render('index', { title: 'Hydra Monitor', what: 'temperature humidity',author: 'MLP'})
//	}.bind(this));
    
    this.httpServer.listen(this.config.bindPort, function(){
  	  console.log('Express server listening on '+this.config.bindAddress + ':' + this.config.bindPort);
  	}.bind(this));    
    
    // Bind incoming connection handler.
    this.socketIo.on('connection', this.socketIOConnectionHandler.bind(this));
}

/**
 * Prepares the GPIO helper: https://www.npmjs.com/package/pi-gpio.
 *
 * Instruction on how to install for the system user running this server: https://www.npmjs.com/package/pi-gpio
 *
 * @function
 */
JSGPIOServer.prototype.prepareGPIOHandler = function() {
    //this.gpio = require("pi-gpio");
}

var all_d=[]; 
/**
 * Handles incoming socket connections. Binds event handlers.
 * @param {Object} socket
 */
JSGPIOServer.prototype.socketIOConnectionHandler = function (socket) {
    // Log incoming request.
    console.log("Incoming socket connection from: " + socket.handshake.address);

    // Bind event handlers.
    socket.on('write', this.writeEventHandler(socket).bind(this));

	socket.emit('init', {interval:this.config.interval, limit:this.config.limit});
	if(all_d.length>0) {
		socket.emit('history', all_d);
	}
	
	socket.on( 'reqint', function(d) {
		if(!isNaN(d)) {
			interval=d;
			console.log('setting update interval to %d.', d);
		}
		socket.broadcast.emit('setint', d);
	});
	
	socket.on('disconnect', function(){
		console.log('disconnected');
	});
	socket.on('lights', function(){
		console.log('lights');
	});
};

/**
 * Creates a pin write event handler.
 * @param socket {Object}
 * @returns {Function}
 */
JSGPIOServer.prototype.writeEventHandler = function (socket) {
    /**
     * Handles a pin write event, requested by the client.
     *
     * NOTE: The data.pin and data.value values _MUST_ be of data type number!
     *
     * @param {Object} data Requires the pin and value properties. See JSGPIOClient.prototype.write function definition.
     * @function
     */
    return function (data) {
        console.log("Write event data: ");
        console.log(data);

        try {
            // Write to pin, as per: https://www.npmjs.com/package/pi-gpio
//            this.gpio.open(data.pin, "output", function(error) {
//                if (error) {
//                    this.emitErrEvent(socket, data, error.message);
//                } else {
//                    this.gpio.write(data.pin, data.value, function() {
//                        this.gpio.close(data.pin, function() {
//                            // Notify the client that we sent data.
//                            this.emitWroteEvent(socket, data);
//                        }.bind(this));
//                    }.bind(this));
//                }
//            }.bind(this));
        	console.log(' Write to pin ' + data.pin + " value " + data.value);
        } catch (ex) {
            this.emitErrEvent(socket, data, ex.message);
        }
    }.bind(this);
}

/**
 * Emits a 'wrote' event to the client, indicating which pin data was sent to and the value.
 * @param socket {Object}
 * @param {Object} data As received by writeEventHandler.
 * @function
 */
JSGPIOServer.prototype.emitWroteEvent = function (socket, data) {
    socket.emit('wrote', data);
}

/**
 * Emits an err event to the client, including data and error message.
 * @param socket {Object}
 * @param {Object} data As received by writeEventHandler. A 'message' property will be added to this object.
 * @param {String} message
 * @function
 */
JSGPIOServer.prototype.emitErrEvent = function (socket, data, message) {
    data.message = message;
    console.log("Error: ");
    console.log(data);
    socket.emit('err', data);
}

// Export server class.
module.exports = JSGPIOServer;