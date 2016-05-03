var config={
	author: '',	
	version:'0.0.5-alpha',
	bindAddress:'0.0.0.0',
	bindPort:4443,
	mongoHost:'localhost',
	mongoPort:27017,
	bh1750Enable:false,
	probeSensorEnable:true,
	dhtEnable:true,
	dhtTimeout:300000,// millis
	probeTimeout:5,//mins 
	dhtVersion:11,
	dhtPin: 24
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

