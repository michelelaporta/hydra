var config={
	author: 'Anonymous',	
	version:'0.0.1-alpha',
	bindAddress:'0.0.0.0',
	bindPort:8000,
	mongoHost:'localhost',
	mongoPort:27017,
	interval:60,//sec
	bh1750Enable:false,
	probeSensorEnable:true,
	//limit:1440,
	limit:10,
	dhtVersion:22,
	dhtPin: 24,
	dhtTimeout:300000,// 5mins
	lightsPin: 11,
	fansPin: 13,
	lightsOn:{hour:'18',minute:'59'},
	lightsOff:{hour:'12',minute:'59'},
	isVeg: true,
	targetHumidity:40,
	"relay1":{"pin":11,"gpio":17},
	"relay2":{"pin":13,"gpio":27,enable:true,airExchangeNumber:70,flowCapacity: 145},
	"relay3":{"pin":15,"gpio":22,targetTemperature:25},
	"relay4":{"pin":19,"gpio":10},
	"relay5":{"pin":21,"gpio":09},
	"relay6":{"pin":23,"gpio":11},
	"relay7":{"pin":12,"gpio":18},
	"relay8":{"pin":16,"gpio":23},
	
	
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

