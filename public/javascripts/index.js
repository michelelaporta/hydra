var socket=io.connect();
var d1=[], d5=[], d15=[];
var zone_delta=(new Date()).getTimezoneOffset()*60000;// time diff in ms
var interval=60,limit=200; // show 2 hours data (7200/5) at interval=5sec

var meteoData = [];
var temperature = [];
var humidity = [];
var lights;
var fans;

$(function() {
	console.log('init bootstrapToggle()');
    $('#fans').bootstrapToggle();
    $('#lights').bootstrapToggle();
    $('#mode').bootstrapToggle();
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
	});
	lights = $('[data-toggle="lights-toggle"]').parent();
	fans = $('[data-toggle="fans-toggle"]').parent();
});



socket.on('setint', function(v) {
	if (!isNaN(v)) {
		console.log('got setint');
		$('#update_int_lbl').text(v);
		$('#update_int').slider('option', 'value', v);
	}
});
  
socket.on('initialization', function(v) {
	if(v.interval){
		interval=v.interval;
		//console.log('INIT interval:' + interval);
		$('#update_int_lbl').text(interval);
		$('#update_int').slider('option', 'value', interval);
	}
	if(v.limit)
		limit=v.limit;
	
	if(v.lights){
		lights.removeClass('toggle btn btn-default off') ;
		lights.addClass('toggle btn btn-default on') ;
	}else{
		lights.removeClass('toggle btn btn-default on') ;
		lights.addClass('toggle btn btn-default off') ;
	}
	
	if(v.fans){
		fans.removeClass('toggle btn btn-default off') ;
		fans.addClass('toggle btn btn-default on') ;
		
	}else{
		fans.removeClass('toggle btn btn-default on') ;
		fans.addClass('toggle btn btn-default off') ;
	}
	
//	var mode = $('[data-toggle="mode-toggle"]').parent();
//	mode.removeClass('toggle btn btn-default off') ;
//	mode.addClass('toggle btn btn-default on') ;

//	var lights = $('[data-toggle="lights-toggle"]').parent();
//	var fans = $('[data-toggle="fans-toggle"]').parent();
//	$('#lights').bootstrapSwitch('toggleDisabled');
//	$('#fans').bootstrapSwitch('toggleDisabled');
//	$('#lights').bootstrapToggle('disable');
//	$('#fans').bootstrapToggle('disable');
});

socket.on('meteoHistory', function(data) {
	console.log('meteoHistory data length ' + data.length);
	
	for(var i=0; i< data.length;i++) {
		var v = data[i];
		//console.log('HISTORY v['+i+']' + v);
		var currentDate = new Date(v.date);
		var ts=currentDate.getTime() -zone_delta;
		
		var ts=v[0]-zone_delta;
		
		temperature.push([ts, v[1]]);	
		humidity.push([ts, v[2]]);	
		meteoData.push([ts,data]);
	}

	console.log('HISTORY temperature data length ' + temperature.length);
	console.log('HISTORY temperature data length ' + temperature.length);
	console.log('HISTORY meteoData length ' + meteoData.length);

	rePlotMeteo();
	
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
	rePlotMeteo();
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

function rePlotMeteo() {
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
	
	var fTP = new Date().getTime();
//	console.log('FIRST meteoData ELEMENT ' + meteoData[0]);
	if (!isNaN(meteoData[0])) {
		var firstTimeStamp = meteoData[0];
		console.log('firstTimeStamp ' + firstTimeStamp);
		fTP = firstTimeStamp[0];
		
	}
	
	var lastTimeStamp = meteoData[meteoDataLen-1][0];
	
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

$(function() {
    $('#fans').change(function() {
    	console.log('fans status ' + $(this).prop('checked'));
    	socket.emit('fans', {status: $(this).prop('checked')});
    })
});

$(function() {
    $('#lights').change(function() {
    	console.log('lights status ' + $(this).prop('checked'));
    	socket.emit('lights', {status: $(this).prop('checked')});
    })
});

$(function() {
	$("#whole").change(function () {
		console.log('whole temperature:' +temperature.length + ' humidity:' + humidity.length );
		
/**
		var fTP = new Date().getTime();
//		console.log('FIRST meteoData ELEMENT ' + meteoData[0]);
		if (!isNaN(meteoData[0])) {
			var firstTimeStamp = meteoData[0];
			console.log('firstTimeStamp ' + firstTimeStamp);
			fTP = firstTimeStamp[0];
			
		}
		
		var lastTimeStamp = meteoData[meteoDataLen-1][0];
		
		console.log('firstTimeStamp ' + fTP);
		console.log('lastTimeStamp ' + lastTimeStamp);
		
		var tick_int = Math.round( (lastTimeStamp-fTP)/60000);
		*/
		var tick_int = 6000;
		
		var d=[
				{ data: temperature, label:'last 1 min load'},
				{ data: humidity, label:'last 5 min load'}
			];
//		$.plot("#placeholder", [d], {
//			xaxis: { mode: "time" }
//		});
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
	});
});


function getWhole() {
	console.log('getWhole');
	socket.emit('onHistory');
	socket.emit('onHistory', 'all');

	$('.whole').hide();
}