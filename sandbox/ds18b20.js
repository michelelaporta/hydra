(function schedule() {
	setTimeout( function () {

		exec('./ds18b20.sh',
		  function (error, stdout, stderr) {
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		    else
		    {
		    	console.log('executing ds18b20.sh');
			    //do stuff if collectionDriver is defined and not null
		        if ( typeof collectionDriver !== 'undefined' && collectionDriver )
		        {
			        var object = {temperature: ''+stdout};
			        collectionDriver.save('water',object , function(err,docs) {
			            if (err) { 
			            	console.error(err);
			            }
			            else 
			            {	
			            	var waterData = [stdout];
			            	var ts=(new Date()).getTime();
			            	waterData.unshift(ts);
			            	//all_d.push(uptime_arr)
//			        		if(all_d.length>limit) {
//			        			all_d=all_d.slice(0-limit);
//			        		}
//			            	console.log('emit waterData: ' + waterData);
		            		//io.sockets.emit('waterData', waterData);
			            	console.log('Temperature: ' + stdout + 'C');
			            	
			            }
			        });
		        }
		        else
		        {
		        	console.log("null driver");
		        }
		    }
		});

		schedule();
		
}, 5000);
})();
process.on('SIGINT', exit);