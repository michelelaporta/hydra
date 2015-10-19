var config={
	version:"0.0.1-alpha",
	bindAddress:"0.0.0.0",
	bindPort:8000,
	mongoHost:"localhost",
	mongoPort:27017,
	interval:60,//sec
	limit:1440,
	dhtVersion:22,
	dhtPin: 4,
	lightsPin: 13,
	fansPin: 15
};

module.exports=config;
