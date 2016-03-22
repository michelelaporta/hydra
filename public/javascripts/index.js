var socket=io.connect();


var d1=[], d5=[], d15=[];
var zone_delta=(new Date()).getTimezoneOffset()*60000;// time diff in ms
var interval=60,limit=200; // show 2 hours data (7200/5) at interval=5sec

var meteoData = [];
var temperature = [];
var humidity = [];
var lights;
var fans;
var cpu;

$(function() {
	console.log('init bootstrapToggle()');
    $('#fans').bootstrapToggle();
    $('#lights').bootstrapToggle();
    $('#mode').bootstrapToggle();
    /**
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
	*/
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
});

socket.on('initLights', function(v) {
	
	lights = $('[data-toggle="lights-toggle"]').parent();

	console.log('lights:'+lights+' initLights ' +v.lights);
	if(v.lights){
		lights.removeClass('toggle btn btn-default off') ;
		lights.addClass('toggle btn btn-default on') ;
	}else{
		lights.removeClass('toggle btn btn-default on') ;
		lights.addClass('toggle btn btn-default off') ;
	}
});

socket.on('initFans', function(v) {
	
	fans = $('[data-toggle="fans-toggle"]').parent();
	console.log('initFans ' +v.fans);
	if(v.fans){
		fans.removeClass('toggle btn btn-default off') ;
		fans.addClass('toggle btn btn-default on') ;
		
	}else{
		fans.removeClass('toggle btn btn-default on') ;
		fans.addClass('toggle btn btn-default off') ;
	}
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

	var  dataArray = [];

	if ( $.isArray( data ) ) {
		dataArray = data;
	}else{
		console.log('single data element ' + data);
		dataArray.push(data);
	}
	
	for(var i = 0 ; i < dataArray.length ;i++){
		var currentDate = new Date(dataArray[i].createdAt);
		var ts=currentDate.getTime() -zone_delta;
		temperature.push([ts, dataArray[i].temperature]);	
		humidity.push([ts, dataArray[i].humidity]);	
		meteoData.push([ts,dataArray[i]]);

	}
	$('.legendTemp').html('<p><strong>Temp:</strong> '+dataArray[dataArray.length-1].temperature+'</p>');
	$('.legendHum').html('<p><strong> Hum:</strong> '+ dataArray[dataArray.length-1].humidity+'</p>');
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
	$('.lightData').html('<p><strong>Lumen</strong> '+v.light);
});

socket.on('cpuData', function(response,response2) {
	console.log('cpu temp ' +response + ' ' + response2);
	$('.cpuData').html('<p><strong>Temp:</strong> '+response2);
});

function rePlotMeteo() {
	console.log('meteoDataLen ' + meteoData.length + ' limit ' + limit);
	
	if(meteoData.length<1)
		return; 
	
	// slice arrays if len>limit
	if(meteoData.length>limit) {
		temperature=temperature.slice(0-limit);
		humidity=humidity.slice(0-limit);
		meteoData = meteoData.slice(0-limit);
	}
	meteoDataLen = meteoData.length;
	
	var now = new Date().getTime();
	if (!isNaN(meteoData[0][0])) {
		var firstTimeStamp = meteoData[0][0];
		now = firstTimeStamp;
	}
	
	var lastTimeStamp = meteoData[meteoDataLen-1][0];
	var tick_int = Math.round( (lastTimeStamp-now)/5000);
	
	console.log('temperature array ' + temperature.length);
	console.log('humidity array ' + humidity.length);
	
	var series=[
		{ data: temperature, label:'last 1 min load'},
		{ data: humidity, label:'last 5 min load'}
	];
	
	$.plot($('#testflot'), 
			series,
		{
			xaxis:{
			 mode:'time', 
			 timeFormat:'%h:%M:%S', 
			 tickSize:[tick_int, "second"],
			 twelveHourClock: true
			},
			legend: { container: $('#plotLegend') }
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
		
		var tick_int = 6000;
		
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
				legend: { container: $('#plotLegend') }
			}
		);		
	});
});


function getWhole() {
	console.log('getWhole');
	socket.emit('onHistory', 'all');
	$('.whole').hide();
}

socket.on('liveStream', function(url) {
	  console.log('on liveStream ' + url);
  $('#stream').attr('src', url);
});

function takeSnapshot() {
//	var value = $('.start').html();
	socket.emit('takeSnapshot');
//	if(value == 'Start Camera'){
//		socket.emit('startStream');
//		$('.start').html('Stop Camera');
//	}else{
//		socket.emit('stopStreaming');
//		$('.start').html('Start Camera');
//		
//	}
}