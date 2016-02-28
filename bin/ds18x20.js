var sensor = require('ds18x20');
var loaded;
var moment = require("moment");

sensor.isDriverLoaded(function (err, isLoaded) {
	if(err)
		throw err;
	loaded = isLoaded;
});

if(loaded == false)
{
	console.log('loading ds18x20 driver..');
	sensor.loadDriver(function (err) {
	    if (err) 
	    	throw err;
	});
}

exports.probe = function probe(device,emitter){
	var value = sensor.get(device);
	//console.log('probe(device='+device+',value='+value+') ' + moment().format());
	return value;
}
