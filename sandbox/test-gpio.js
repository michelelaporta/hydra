var gpio = require("pi-gpio");
gpio.open(22, "output", function(error) {
	if (error) {
		console.log(error);
	} else {
		gpio.write(22, 1, function() {
			console.log('write');
			gpio.close(22, function() {
				// Notify the client that we sent data.
				console.log('close');
			});
		});
	}
});

(function schedule() {
setTimeout( function () {
	gpio.close(22, function() {
		// Notify the client that we sent data.
		console.log('close');
	});
},5000);
});
