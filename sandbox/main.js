//var http = require('http'),
//    express = require('express'),
var    os = require('os'),
    routes = require('./routes'),
    about = require('./routes/about'),
    graph = require('./routes/graph'),
    config = require('./config'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver;



// use all_d to hold config.limit number of data sets for initial connections
var limit=config.limit, interval=config.interval, all_d=[]; 
var sys = require('sys');
var exec = require('child_process').exec;

var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var collectionDriver;
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B
mongoClient.open(function(err, mongoClient) { //C
	  if (!mongoClient) {
	      console.error("Error! Exiting... Must start MongoDB first");
	      process.exit(1); //D
	  }
	  var db = mongoClient.db("Hydra");  //E
	  collectionDriver = new CollectionDriver(db); //F
	});

var sensorLib = require('node-dht-sensor');

var sensor = {
	    initialize: function () {
	        return sensorLib.initialize(22, 4);
	    },
	    read: function () {
	        var readout = sensorLib.read();
	        var temperature = readout.temperature.toFixed(2);
	        var humidity = readout.humidity.toFixed(2);

	        //do stuff if collectionDriver is defined and not null
	        if ( typeof collectionDriver !== 'undefined' && collectionDriver )
	        {
	        	if(temperature !== '0.00' && humidity !== '0.00')
	        	{
			        var object = {temperature: ''+temperature,humidity: ''+humidity};
			        collectionDriver.save('meteo',object , function(err,docs) {
			            if (err) { 
			            	console.error(err);
			            }
			            else { 
			            	
				            if( ((temperature-2) <= temperature && temperature >= (temperature+2)) && ((humidity-2) <= humidity && humidity >= (humidity+2)))
			            	{
				            	console.log("out-of-range temperature " + temperature + " and humidity " + humidity);
				            	//console.log("out-of-range humidity " + humidity);
			            	}
			            	
			            	var meteoData = [temperature,humidity];
			            	var ts=(new Date()).getTime();
			            	meteoData.unshift(ts);
			            	all_d.push(meteoData)
			        		if(all_d.length>limit) {
			        			all_d=all_d.slice(0-limit);
			        		}
			            	io.sockets.emit('newdata', meteoData);

			            	console.log('Temperature: ' + temperature + 'C, ' +' humidity: ' + humidity + '%')
			            }
			        });
	        	}
	        	else
	        	{
	        		// Temperature: 0.00C, humidity: 0.00%	
	        	}
	        }
	        else
	        {
	        	//console.log("error get collectionDriver");
	        }
	        
	        setTimeout(function () {
	            sensor.read();
	        }, 60000);// 1min
	    }
	};

if (sensor.initialize()) {
    sensor.read();
} else {
    console.warn('Failed to initialize sensor');
}

//Load module.
var JSGPIOServer = require('./jsgpio-server.js');

// Create server...
new JSGPIOServer(config);

var gpio = require("pi-gpio");

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

    gpio.close(22, function() {
      // Notify the client that we sent data.
      //this.emitWroteEvent(socket, data);
        console.log('closE');
    });
    console.log("Exiting...");
    process.exit();
});