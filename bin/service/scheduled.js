var moment = require("moment");
var fs = require("fs");
var arm = process.arch === 'arm';
var now = moment();
var currentService;
var cron = require('node-schedule');

/** Constructor */
function Scheduled(service) {
  this.currentService = service;
}

// class methods
Scheduled.prototype.getService = function() {
	return this.currentService;
};

var startJob,stopJob;

//class methods
Scheduled.prototype.start = function() {
	if(this.getService().getChannel().enable){
		console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss')+ ' start scheduled [name:'+this.getService().getChannel().name+',start:(' + this.getService().getChannel().start+'),stop:('+this.getService().getChannel().stop+')]');

		// OPEN GPIO
		this.getService().open();
		
		startJob = cron.scheduleJob(this.getService().getChannel().start, function(srv){
			  //console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' run cron start channel ['+ srv.getChannel().name+ '] isOn[' + srv.isOn()+']');
			  srv.on();
		}.bind(null,this.getService()));
		
		stopJob = cron.scheduleJob(this.getService().getChannel().stop, function(srv){
			  //console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss') + ' run cron stop channel ['+ srv.getChannel().name+ '] isOn[' + srv.isOn()+']');
			  srv.off();
		}.bind(null,this.getService()));
		
	}
}

Scheduled.prototype.stop = function() {
	if(this.getService().getChannel().enable){
		startJob.cancel();
		stopJob.cancel();
		
		// CLOSE GPIO
		this.getService().close();
		console.log(moment().format('YYYY[-]MM[-]DD hh:mm:ss')+ ' stop scheduled channel [name:'+this.getService().getChannel().name+',start:(' + this.getService().getChannel().start+'],stop('+this.getService().getChannel().stop+')]');
	}
}

module.exports = Scheduled;

