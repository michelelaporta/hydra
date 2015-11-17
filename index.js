var http = require('http'),
    express = require('express'),
    os = require('os'),
    routes = require('./routes'),
    about = require('./routes/about'),
    graph = require('./routes/graph'),
    config = require('./utils/config'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./utils/collectionDriver').CollectionDriver;
    

var arch = process.arch;
var arm = process.arch === 'arm';
var lightsPin = parseInt(config.lightsPin);
var fansPin = parseInt(config.fansPin);

//http://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js
var interfaces = os.networkInterfaces();
//var addresses = [];
var ip ;
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            //addresses.push(address.address);
        	ip = address.address;
        }
    }
}
console.log('ip ' + ip);

// use all_d to hold config.limit number of data sets for initial connections
var limit=config.limit, interval=config.interval, all_d=[];

if(arm)
{
	console.log('Arch:' + arch);
	var BH1750 = require('./bh1750');
	var light = new BH1750();
}
else
{
	// dev mode x86
	interval = 5;
}

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

//http://stackoverflow.com/questions/25393578/nodejs-and-express-how-to-print-all-the-parameters-passed-in-get-and-post-requ
//var bodyParser = express.bodyParser();
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
//app.use(bodyParser.json());
// parse application/vnd.api+json as json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var preferences = require('./routes/preferences')(CollectionDriver);

// Routes
app.get('/', routes.index);
app.get('/about', about.list);
app.get('/graph', graph.show);
app.get('/preferences', preferences.list);
//app.post('/preferences', preferences);
//app.get('/flot', routes.history);

function gt() {
	return (new Date()).getTime()-18000000;
}

function between(x, min, max) {
  return x >= min && x <= max;
}


mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("Hydra");  //E
  collectionDriver = new CollectionDriver(db); //F
});

app.get('/:collection', function(req, res) { //A
   var params = req.params; //B
   
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.send(400, error); } //D
	      else { 
	          if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
	          res.set('Content-Type','application/json'); //G
                  res.send(200, objs); //H
              }
         }
   	});
});
 
app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //K
       });
   } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

app.post('/:collection',function(req, res) { //A
    var object = req.body;
    //console.log('email ' +  req.body.email);
    //console.log('pwd ' +  req.body.pwd);

    var collection = req.params.collection;
    
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) { res.send(400, err); } 
          else { res.send(201, docs); } //B
     });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C
       });
   } else {
	   var error = { "message" : "Cannot PUT a whole collection" }
	   res.send(400, error);
   }
});

app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" }
       res.send(400, error);
   }
});
 
app.use(function (req,res) {
    res.render('404', {url:req.url});
});


var lightsInitialized = 0;
var fansInitialized = 0;
//var waterInitialized = false;

var lightsStatus = 0;
var fansStatus = 0;
var waterSensor = 0;

var now = new Date();
/** RASPBERRY ONLY */
if(arm)
{
	// GPIO PINS INITIALIZATION
	var gpio = require("pi-gpio");
	
	gpio.open(lightsPin, "output", function(error) {
		if (error)
	        throw error;
		lightsInitialized = true;
	});
	gpio.open(fansPin, "output", function(error) {
		if (error)
	        throw error;
		fansInitialized = true;
	});
	
	var sensorLib = require('node-dht-sensor');
	console.log('initializing DHT'+config.dhtVersion+' sensor on pin '+ config.dhtPin);
	
	var sensor = {
		    initialize: function () {
		        return sensorLib.initialize(config.dhtVersion, config.dhtPin);
		    },
		    read: function () {
		        var readout = sensorLib.read();
		        var temperatureData = readout.temperature.toFixed(2);
		        var humidityData = readout.humidity.toFixed(2);
		        
		        var meteoData = {temperature: temperatureData,humidity: humidityData};
		        saveCollection('meteo',meteoData);
		        
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
	
}

(function schedule() {
	
	setTimeout( function () {

		if(arm)
		{
			var sensor = require('ds18x20');
			var loaded;
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
			
			// TODO use config.ds18x20 address 
			
			var temp = sensor.get('28-000005cff2dd');
			var waterData = {water: ''+temp};
	        console.log('waterData ' + temp);
	        saveCollection('water',waterData);
	        
	        temp = sensor.get('28-000005e66282');
	        waterData = {acqua: ''+temp};
	        console.log('acqua ' + temp);
	        saveCollection('acqua',waterData);
	        
			
//			sensor.get('28-000005e66282', function (err, temp) {
//		        var waterData = {water: ''+temp};
//		        console.log('waterData ' + waterData);
//				
//		        saveCollection('water',waterData);
//			});
//			
//			sensor.get('28-000005e66282', function (err, temp) {
//		        var waterData2 = {water: ''+temp};
//		        console.log('waterData2 ' + waterData2);
//		        saveCollection('water2',waterData2);
//			});

	
			light.readLight(function(value){
			    var lightData = {light:value};
			    saveCollection('light',lightData);
			});

		}
		else
		{	
			//!arm random data
	        var meteoData = {temperature:getRandom(19, 30).toFixed(2),humidity:getRandom(40, 80).toFixed(2)};
	        saveCollection('meteo',meteoData);
	    	
	        var waterData = {water: getRandom(18, 25).toFixed(2)};
	    	saveCollection('water',waterData);

	        waterData = {water: getRandom(18, 25).toFixed(2)};
	    	saveCollection('water2',waterData);

	        var lightData = {light: getRandom(5, 10)};
	        saveCollection('light',lightData);
		}
		
    	// reschedule task
		schedule();
		
	}, interval*1000);
})();	


function saveCollection(collection,value)
{
    if ( typeof collectionDriver !== 'undefined' && collectionDriver )
    {
        collectionDriver.save(collection,value , function(err,docs) {
            if (err) { 
            	console.error(err);
            	return false;
            }
            else { 

        		if(collection === 'meteo')
        		{	
        			if(value["temperature"] !== 0.00 && value["humidity"] !== 0.00)
		        	{
		            	var data = [value["temperature"],value["humidity"]];
		            	var ts=(new Date()).getTime();
		            	data.unshift(ts);
		        		
		        		all_d.push(data);
		        		if(all_d.length>limit) {
		        			all_d=all_d.slice(0-limit);
		        		}
		        		io.sockets.emit(collection, data); 
	        			console.log('save '+collection+' temperature:' + value["temperature"] + ',humidity:' +  value["humidity"]);
		        	}
          	
        		}
        		else
            	{
	            	var data = [value];
	            	var ts=(new Date()).getTime();
	            	data.unshift(ts);
	        		// emit to everyone connected
	        		io.sockets.emit(collection, data);
	        		var jsonData = JSON.stringify(value);
	
            		console.log('save ' + collection.toString() + ':' +  value[""+collection]);
            	}
            }
        });
    }
}

function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

var server = http.createServer(app);

var io=require('socket.io').listen(server);
// log level
//io.set('log level', 1);


io.sockets.on('connection', function(socket) {
	
	if(arm)
	{
		var gpio = require("pi-gpio");
		//TODO get it from gpio state
		if(lightsInitialized)
		{
			gpio.read(lightsPin, function(err, value) {
			    if(err)
			    	throw err;
			    else
				    lightsStatus = value;
			});
		    console.log('lights: ' + lightsStatus); // The current state of the pin 
		}
		else
			throw new Error('could not determinate light status');
		
		if(fansInitialized)
		{
			gpio.read(fansPin, function(err, value) {
				if(err)
			    	throw err;
			    else
				    fansStatus = value;
			});
		    console.log('fan: ' + fansStatus); // The current state of the pin 
			
		}
		else
			throw new Error('could not determinate fans status');
	}
   
	socket.emit('initialization', {lights:lightsStatus==false, fansPin:fansStatus==false});
	
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
		if(arm)
		{
			var gpio = require("pi-gpio");
			if(d.status)
			{
				// check current gpio state
				if(lightsStatus != 0)
				{
					gpio.write(lightsPin, 0, function() {
						console.log('write lights on');
						lightsStatus = 0;
					});
				}
			}
			else
			{
				// check current gpio state
				if(lightsStatus != 1)
				{
		            gpio.write(lightsPin, 1, function() {
						console.log('write lights off');
						lightsStatus = 1;
		            });
				}
			}
		}
		else
		{
			if(d.status)
				console.log('lights on');
			else
				console.log('lights off');
		}
	});
	
	socket.on('fans', function(d)
	{
		if(arm)
		{
			var gpio = require("pi-gpio");
			if(d.status)
			{
				// check current gpio state
				if(fansStatus != 0)
				{
					gpio.write(fansPin, 0, function() {
						console.log('write fans on');
						fansStatus = 0;
					});
				}
			}
			else
			{
				// check current gpio state
				if(fansStatus != 1)
				{
		            gpio.write(fansPin, 1, function() {
						console.log('write fans off');
						fansStatus = 1;
		            });
				}
			}
		}
		else
		{
			if(d.status)
			{
				fansStatus = 0;
				console.log('fans on');
			}
			else
			{
				fansStatus = 1;
				console.log('fans off');
			}
		}
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on '+app.get('domain')+ ':' + app.get('port'));
});


//http://www.codexpedia.com/javascript/nodejs-cron-schedule-examples/
var cron = require('node-schedule');
/**
//light schedule off at 6:59 am:
cron.scheduleJob('59 6 * * *', function(){
	if(arm)
	{
		var gpio = require("pi-gpio");
		gpio.write(lightsPin, 0, function() {
			lightsStatus = 1;
			console.log('scheduled write light off at ' + new Date());
		});
	}
	else
	{
		console.log('scheduled write light off at ' + new Date());
		lightsStatus = 1;
	}
});

//Every even minute
cron.scheduleJob('0-58/2 * * * *', function(){

//light schedule on at 12:59 am:
cron.scheduleJob('59 18 * * *', function(){
    console.log('light on at ' + new Date());
    if(arm)
	{
		var gpio = require("pi-gpio");
		gpio.write(lightsPin, 1, function() {
			console.log('scheduled write light on at ' + new Date());
			lightsStatus = 0;
		});
	}
	else
	{
		lightsStatus = 0;
		console.log('scheduled write light on at ' + new Date());
	}    
});
*/

process.on('SIGTERM', function() {
    console.log("\nShutdown..");
    if(arm)
	{
	    gpio.close(13, function() {
	      // Notify the client that we sent data.
	      //this.emitWroteEvent(socket, data);
	      console.log('closed lights pin '+lightsPin);
	    });
	    gpio.close(fansPin, function() {
	      // Notify the client that we sent data.
	      //this.emitWroteEvent(socket, data);
	      console.log('closed fans pin '+fansPin);
	    });
	}
    console.log("Exiting...");
    process.exit();
});
