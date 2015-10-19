exec('sudo gpio mode 6 out',
		  function (error, stdout, stderr) {
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		    else
		    {
		    	console.log('gpio mode 6 out successfully');
		    }
		});