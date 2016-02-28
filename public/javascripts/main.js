var socket=io.connect();
var d1=[], d5=[], d15=[];
var zone_delta=(new Date()).getTimezoneOffset()*60000;// time diff in ms

var meteoData = [];
var temperature = [];
var humidity = [];
var lights = false;
var fans = false;
var interval,limit=200; // show 2 hours data (7200/5) at interval=5sec


socket.on('meteoHistory', function(data) {
	console.log('meteoHistory data length ' + data.length);
	for(var i=0, l=data.length;i<l;i++) {
		var v = data[i];
		var currentDate = new Date(v.date);
		var ts=currentDate.getTime() -zone_delta;
		
		var ts=v[0]-zone_delta;
		
		temperature.push([ts, v[1]]);	
		humidity.push([ts, v[2]]);	
		
	}
	meteoData.push([ts,data]);

	console.log('temperature data length ' + temperature.length);
	console.log('humidity data length ' + humidity.length);

	reflotMeteo();
	
	console.log('meteoHistory plot complete');
	
});

socket.on('meteoData', function(data) {
	var currentDate = new Date(data.createdAt);
	var ts=currentDate.getTime() -zone_delta;
	console.log('got meteoData currentDate ' + currentDate + ' ts ' + ts);

	temperature.push([ts, data.temperature]);	
	humidity.push([ts, data.humidity]);	
	meteoData.push([ts,data]);
	$('.legend').html('<p><strong>Temp:</strong> '+data.temperature+'</p><p><strong>Hum:</strong> '+ data.humidity);
	reflotMeteo();
});

socket.on('waterData', function(response) {
	console.log('water data ' +response.water);
	$('.legendWaterData').html('<p><strong>Temp:</strong> '+response.water);
});

socket.on('water2Data', function(v) {
	console.log('water2 data ' +v.water2);
	$('.legendWater2Data').html('<p><strong>Temp:</strong> '+v.water2);
});

socket.on('lightData', function(v) {
	console.log('light data ' +v.light);
	$('.lightData').html('<p><strong>Luminosity:</strong> '+v.light);
});

function reflotMeteo() {
	console.log('meteoDataLen ' + meteoData.length + ' limit ' + limit);
	
	if(meteoData.length<1)
		return; 
	
	// slice arrays if len>limit
	if(meteoData.length>limit) {
		console.log('temperature.length:'+temperature.length);
		temperature=temperature.slice(0-limit);
		console.log('temperature.length:'+temperature.length);
		console.log('humidity.length:'+humidity.length);
		humidity=humidity.slice(0-limit);
		console.log('humidity.length:'+humidity.length);
		
		console.log('meteoData.length:'+meteoData.length);
		meteoData = meteoData.slice(0-limit);
		console.log('meteoData.length:'+meteoData.length);
	}
	meteoDataLen =meteoData.length;
	
	var firstTimeStamp = meteoData[0];
	var lastTimeStamp = meteoData[meteoDataLen-1][0];
	var fTP = firstTimeStamp[0];
	console.log('firstTimeStamp ' + fTP);
	console.log('lastTimeStamp ' + lastTimeStamp);
	
	
	var tick_int = Math.round( (lastTimeStamp-fTP)/5000);
	console.log('tick_int ' + tick_int);
	
	var d=[
		{ data: temperature, label:'last 1 min load'},
		{ data: humidity, label:'last 5 min load'}
	];
	
	$.plot(
		$('#testflot'), 
		d,
		{
			xaxis:{
			 mode:'time', 
			 timeFormat:'%h:%M:%S', 
			 tickSize:[tick_int, "second"],
			 twelveHourClock: true
			},
			legend: { container: $('#legend') }
		}
	);
}

//socket.on('waterData', function(data) {
//	var currentDate = new Date(data.date);
//	var ts=currentDate.getTime() -zone_delta;
//	temperature.push([ts, data.temperature]);	
//	humidity.push([ts, data.humidity]);	
//	meteoData.push([ts,data]);
//	$('.legend').html('<p><strong>Temp:</strong> '+data.temperature+'</p><p><strong>Hum:</strong> '+ data.humidity);
//	reflotMeteo();
//});




socket.on('meteo', function(v) {
	console.log('meteo ' +v);
	var ts=v[0]-zone_delta;
	d1.push([ts, v[1]]);	
	d5.push([ts, v[2]]);	
//	d15.push([ts, v[3]]);	
	re_flot();	
	var i=1;
	$('#legend').find('tr').each(function() {
		$(this).append('<td class="last_val">'+v[i++]+'</td>');
	});
});

socket.on('history', function(a) {
	for(var i=0, l=a.length;i<l;i++) {
		var v=a[i],  ts=v[0]-zone_delta;
		d1.push([ts, v[1]]);	
		d5.push([ts, v[2]]);	
//		d15.push([ts, v[3]]);	
	}
	re_flot();
});

function re_flot() {
	var d1_len=d1.length;
	if(d1_len<1) { return; }
	// slice arrays if len>limit
	if(d1_len>limit) {
		d1=d1.slice(0-limit);
		d5=d5.slice(0-limit);
//		d15=d15.slice(0-limit);
	}
	d1_len=d1.length;
	var tick_int=Math.round((d1[d1_len-1][0]-d1[0][0])/5000);
	var d=[
		{ data: d1, label:'last 1 min load'},
		{ data: d5, label:'last 5 min load'}
//		,
//		{ data: d15, label:'last 15 mins load'}
	];
	//console.log('re_flot() ' +d1 + ' ' +d5 );
	
	$.plot(
		$('#testflot'), 
		d,
		{
			xaxis:{
			 mode:'time', 
			 timeFormat:'%h:%M:%S', 
			 tickSize:[tick_int, "second"],
			 twelveHourClock: true
			},
			legend: { container: $('#legend') }
		}
	);
}

$(function() {
	$('#update_int').slider( {
		min:5,
		max:30,
		step:5,
		value:interval,
		slide: function(event, ui) {
			console.log('update slider ' + ui.value);
			$('#update_int_lbl').text(ui.value);
			socket.emit('reqint', ui.value);
		}
	} );
});

//var $payloadMeter = null;
//
//$(function () {
//	console.log("dynameter calls " + $payloadMeter);
//	$payloadMeter = $('div#payloadMeterDiv').dynameter({
//        // REQUIRED.
//        label: 'payload',
//        value: 500,
//        unit: 'lbs',
//        min: 0,
//        max: 1000,
//        regions: {
//            800: 'warn',
//            900: 'error'
//        }
//    });
//	$payloadMeter.changeValue(238);
//});
