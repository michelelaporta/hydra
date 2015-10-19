var sensor = require('ds18x20');
var waterInitialized = false;

(function schedule() {
	setTimeout( function () {
		var sensor = require('ds18x20');

		//sensor.isDriverLoaded(function (err, isLoaded) {
//		    console.log(isLoaded);
		//});
//		if(!waterInitialized)
			sensor.loadDriver(function (err) {
			    if (err) console.log('something went wrong loading the driver:', err)
			    else 
			    {
			    	console.log('driver is loaded');
			    	waterInitialized = true;
			    }
			});

//		sensor.list(function (err, listOfDeviceIds) {
//		    console.log(listOfDeviceIds);
//		});
//		var listOfDeviceIds = sensor.list();
//					sensor.get(listOfDeviceIds, function (err, temp) {
//					    console.log(temp);
//					});			
//		while(waterInitialized==false)
//		{}
//		console.log('waterInitialized ' + waterInitialized);
//		if(waterInitialized)
//		{
			sensor.get('28-000005cff2dd', function (err, temp) {
			    waterSensor = temp;
			    console.log("Water Temperature " + waterSensor + " C");

		        var waterData = {water: ''+waterSensor};
		        //TODO store date also
		        collectionDriver.save('water',waterData , function(err,docs) {
		            if (err) { 
		            	console.error(err);
		            }
		            else { 
		            	//var uptime_arr=os.loadavg();
		            	//var random = (Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(2);
		            	var waterData = [waterTemp];
		            	var ts=(new Date()).getTime();
		            	waterData.unshift(ts);
		            	console.log('Water Temperature: ' + waterTemp + 'C');
	            		//emit to everyone
	            		io.sockets.emit('waterData', waterData);
	            		//if you need to emit to everyone BUT the socket who emit this use:
	            	    //socket.broadcast.emit('meteoData', meteoData);

		            }
		        });
			});
//		}
	}, 1*5000);
})();	

////sensor.isDriverLoaded(function (err, isLoaded) {
////    console.log(isLoaded);
////});
//
//sensor.loadDriver(function (err) {
//    if (err) console.log('something went wrong loading the driver:', err)
//    else console.log('driver is loaded');
//});
//
//sensor.list(function (err, listOfDeviceIds) {
//    console.log(listOfDeviceIds);
//});
//
//
////sensor.get('28-000005cff2dd', function (err, temp) {
////    console.log(temp);
////});
//var listOfDeviceIds = sensor.list();
//
//sensor.get(listOfDeviceIds, function (err, temp) {
//    console.log(temp);
//});

