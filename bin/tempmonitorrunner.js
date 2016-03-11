var co2Monitor  = require('./tempmonitor.js');

co2Monitor.data().on('rawData', function(data) {
    //co2Monitor.startTransfer();
	console.log("co2 " + data);
})

//co2Monitor.data().on('rawData', function(data) {
//    console.log("co2 " + data);
//})
//
//co2Monitor.data().on('temp', function(data) {
//    console.log("temp " + data);
//})

co2Monitor.print('ciao');