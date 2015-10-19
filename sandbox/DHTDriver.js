
/**
 * 
 * @param {Object} config Configuration object. Requires the dhtVersion,dhtPin properties.
 * @constructor
 */
function DHTDriver(config) {
	
    // Store configuration for later use.
    this.config = config;

    // Create server.
    this.initializeSensor();

}

DHTDriver.prototype.initializeSensor = function() {
	//this.sensorLib = require('node-dht-sensor');
	//this.sensorLib.initialize(this.config.dht.version,this.config.dht.pin);
	console.log('initializeSensor');
}


DHTDriver.prototype.readSensor = function () {
    return function () {
    	console.trace();
        console.log("readSensor");
        return [22,60];
//        try {
//        	var readout = this.sensorLib.read();
//	        var temperature = readout.temperature.toFixed(2);
//	        var humidity = readout.humidity.toFixed(2);
//	        return [temperature,humidity];
//        } catch (ex) {
//        	console.log(ex.message);
//        	return null;
//        }
    }.bind(this);
}

DHTDriver.prototype.read = function () {
	console.log("read");
	return [20,60];
	//console.trace();
}

//Export class.
module.exports = DHTDriver;