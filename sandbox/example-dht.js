// Load module.
var DHTDriver = require('./DHTDriver.js');
// Create server...
var object = new DHTDriver({
    dht: {
        // Bind to port 8000.
        version: 22,
        pin:4
    }
});

//var res = DHTDriver.readSensor();
console.log('DHTDriver ' + object);

var result = object.read();
console.log('readSensor result ' + result);
