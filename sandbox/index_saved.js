var http = require('http'),
    express = require('express'),
    os = require('os'),
    routes = require('./routes'),
    about = require('./routes/about'),
    graph = require('./routes/graph'),
    config = require('./config'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver;


//var Gpio = require('onoff').Gpio;
//var led = new Gpio(18, 'out');
var gpio = require("pi-gpio");

// use all_d to hold config.limit number of data sets for initial connections
var limit=config.limit, interval=config.interval, all_d=[]; 
var sys = require('sys');
var exec = require('child_process').exec;

var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var collectionDriver;
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); //B

var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('domain', '0.0.0.0');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser()); // <-- add
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', routes.index);
app.get('/about', about.list);
app.get('/graph', graph.show);
//app.get('/flot', routes.history);


mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("Hydra");  //E
  collectionDriver = new CollectionDriver(db); //F
});


/** RASPBERRY ONLY */
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

/**
(function schedule() {
	setTimeout( function () {

        var temperature = Math.abs((Math.random() * (19.00 - 25.00) + 0.10).toFixed(2));
        var humidity = Math.abs((Math.random() * (40.00 - 80.00) + 0.10).toFixed(2));

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
		            	var uptime_arr=os.loadavg();
		            	//var random = (Math.random() * (0.120 - 0.0200) + 0.0200).toFixed(2);
		            	var meteoData = [temperature,humidity];
		            	var ts=(new Date()).getTime();
		            	meteoData.unshift(ts);
		            	all_d.push(uptime_arr)
		        		if(all_d.length>limit) {
		        			all_d=all_d.slice(0-limit);
		        		}
		            	console.log('Temperature: ' + temperature + 'C, ' +' humidity: ' + humidity + '%')
	            		//emit to everyone
	            		io.sockets.emit('newdata', meteoData);
//		            	var clients = io.of('/graph').clients();
//		            	for (var k in clients){
//		            	    if (clients.hasOwnProperty(k)) {
//		            	    	console.log("Key is " + k + ", value is " + clients[k]);
//		            	    }
//		            	}
	            		//if you need to emit to everyone BUT the socket who emit this use:
	            	    //socket.broadcast.emit('newdata', meteoData);

		            }
		        });
	    	}
	    	else
	    	{
	    		// Temperature: 0.00C, humidity: 0.00%	
	    	}
        }
		schedule();
		
	}, interval*1000);
})();
*/


var server = http.createServer(app);

var io=require('socket.io').listen(server);


//exec('sudo gpio mode 6 out',
//		  function (error, stdout, stderr) {
//		    if (error !== null) {
//		      console.log('exec error: ' + error);
//		    }
//		    else
//		    {
//		    	console.log('gpio mode 6 out successfully');
//		    }
//		});


io.sockets.on('connection', function(socket) {
	
	socket.emit('init', {interval:interval, limit:limit});
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
	
	socket.on('lights', function(d){
		if(d.status == 'ON'){
            gpio.open(22, "output", function(error) {
                if (error) {
                    console.log(error);//this.emitErrEvent(socket, data, error.message);
                } else {
                    gpio.write(22, 1, function() {
                        gpio.close(22, function() {
                            // Notify the client that we sent data.
                            //this.emitWroteEvent(socket, data);
                        	//console.log('disconnected');
                        });
                    });
                }
            });

			
		}else{
            gpio.write(22, 0, function() {
                gpio.close(22, function() {
                    // Notify the client that we sent data.
                    //this.emitWroteEvent(socket, data);
                });
            });
		}
	});
});

server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});


//relay.unexport();
//gpio.close(25);                     // Close pin 16 
//led.unexport();  


//(function schedule() {
//	setTimeout( function () {
//
//		exec('./ds18b20.sh',
//		  function (error, stdout, stderr) {
//		    if (error !== null) {
//		      console.log('exec error: ' + error);
//		    }
//		    else
//		    {
//		    	console.log('executing ds18b20.sh');
//			    //do stuff if collectionDriver is defined and not null
//		        if ( typeof collectionDriver !== 'undefined' && collectionDriver )
//		        {
//			        var object = {temperature: ''+stdout};
//			        collectionDriver.save('water',object , function(err,docs) {
//			            if (err) { 
//			            	console.error(err);
//			            }
//			            else 
//			            {	
//			            	var waterData = [stdout];
//			            	var ts=(new Date()).getTime();
//			            	waterData.unshift(ts);
//			            	//all_d.push(uptime_arr)
////			        		if(all_d.length>limit) {
////			        			all_d=all_d.slice(0-limit);
////			        		}
////			            	console.log('emit waterData: ' + waterData);
//		            		//io.sockets.emit('waterData', waterData);
//			            	console.log('Temperature: ' + stdout + 'C');
//			            	
//			            }
//			        });
//		        }
//		        else
//		        {
//		        	console.log("null driver");
//		        }
//		    }
//		});
//
//		schedule();
//		
//}, 5000);
//})();
//process.on('SIGINT', exit);

