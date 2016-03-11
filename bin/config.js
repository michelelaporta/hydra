var config={
	version:"0.0.1-alpha",
	bindAddress:"0.0.0.0",
	bindPort:8000,
	mongoHost:"localhost",
	mongoPort:27017,
	interval:60,//sec
	//limit:1440,
	limit:200,
	dhtVersion:22,
	dhtPin: 17,
	dhtTimeout:300000,// 5mins
	lightsPin: 12,
	fansPin: 15,
	lightsOn:{hour:'18',minute:'59'},
	lightsOff:{hour:'12',minute:'59'},
	isVeg: true,
	airExchangeNumber:70,
	flowCapacity: 105,
	targetTemperature:25,
	targetHumidity:40
};

module.exports=config;

// 14w 105m3/h 1.75m3/mins
// 21w 145m3/h 2.42m3/mins
// 33w 187m3/h 3.12m2/mins
//F1 8.00-19.00 lun-ven
//F2+F3 19.00-8.00 lun-dom

// Add 20% for a warm attic
// Minus 15% in a cool basement
// Add 20% for long ducting
// Minus 25 - 30% for air cooled lighting

