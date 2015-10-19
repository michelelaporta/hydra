var config = require('./config');


var bindAddress=config.bindAddress;
var bindPort=config.bindPort;

// Load module.
var JSGPIOServer = require('./jsgpio-server.js');

// Create server...
new JSGPIOServer(config);