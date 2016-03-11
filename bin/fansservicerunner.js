if(process.arch === 'arm')var gpio = require("pi-gpio");

var fanservice = require('./fanservice');
fanservice.start();
