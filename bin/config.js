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
	//dhtTimeout:600000,// 10mins
	dhtTimeout:10000,// 10mins
	lightsPin: 12,
	fansPin: 15,
	lightsOn:{hour:'18',minute:'59'},
	lightsOff:{hour:'12',minute:'59'},
	isVeg: true,
	airExchangeNumber:70,
	flowCapacity: 105,
	targetTemperature:24
};

// 14w 105m3/h
// 21w 145m3/h
// 33w 187m3/h
//F1 8.00-19.00 lun-ven
//F2+F3 19.00-8.00 lun-dom
module.exports=config;
