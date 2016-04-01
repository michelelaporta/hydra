var socket=io.connect();
var lights;
var fans;

var water = [];
var humd = [];
var temp = [];

var plot;
var series=[
    {data:water,label:'water'},
    {data:humd,label:'humidity'},
    {data:temp,label:'temperature'}
];

$(function() {
	console.log('init bootstrapToggle()');
    $('#fans').bootstrapToggle();
    $('#lights').bootstrapToggle();
    $('#mode').bootstrapToggle();
	lights = $('[data-toggle="lights-toggle"]').parent();
	fans = $('[data-toggle="fans-toggle"]').parent();
	
	$('#fans').change(function() {
		console.log('fans status ' + $(this).prop('checked'));
		socket.emit('fans', {status: $(this).prop('checked')});
	});
	$('#lights').change(function() {
		console.log('lights status ' + $(this).prop('checked'));
		socket.emit('lights', {status: $(this).prop('checked')});
	});

});

socket.on('initialization', function(v) {
	//console.log('initialization ' + v);
	if(v.interval){
		interval=v.interval;
		console.log('interval:' + interval);
		//$('#update_int_lbl').text(interval);
		//$('#update_int').slider('option', 'value', interval);
	}
	if(v.limit){
		limit=v.limit;
		console.log('limit:' + interval);
	}
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

socket.on('waterData', function(v) {
	$('.legendProbeData').html('<small>Water T:'+v.water+'°</small> ');
	console.log('water ' + v.water);
	var waterData = [];
	waterData.push(new Date().getTime(),v.water);
	water.push(waterData);
	
	replotGraph();
});

//socket.on('tempData', function(v) {
//	$('.legendTempData').html('<label>Temp:'+v.temp+'°</label> ');
//	console.log('temperature ' + v.temp);
//	var waterData = [];
//	waterData.push(new Date().getTime(),v.temp);
//	temp.push(waterData);
//	
//	replotGraph();
//});
//
//socket.on('humData', function(v) {
//	$('.legendHumData').html('<label>Humd:'+v.hum+'%</label> ');
//	console.log('humidity ' + v.hum);
//	var waterData = [];
//	waterData.push(new Date().getTime(),v.hum);
//	humd.push(waterData);
//	
//	replotGraph();
//});

socket.on('meteoData', function(v) {

	$('.legendTempData').html('<small>Temp:'+v.temperature+'°</small> ');
	console.log('temperature ' + v.temperature);
	var waterData = [];
	waterData.push(new Date().getTime(),v.temperature);
	temp.push(waterData);

	$('.legendHumData').html('<small>Humd:'+v.humidity+'%</small> ');
	console.log('humidity ' + v.humidity);
	var waterData = [];
	waterData.push(new Date().getTime(),v.humidity);
	humd.push(waterData);
	
	replotGraph();
});

socket.on('lightData', function(v) {
	$('.lightData').html('<small>Lumen:'+v.light+'</small>');
});

socket.on('cpuData', function(v) {
	$('.cpuData').html('<p><small>Cpu:'+v.cpuData+'</small> ');
});

function replotGraph(){
	plot = $.plot("#placeholder", series,
		{
			xaxis:{
			 mode:'time', 
			 timeFormat:'%h:%M:%S', 
			 tickSize:[60, "minute"],
			 twelveHourClock: true
			},
			//legend: { container: $('#plotLegend') }
		series: {
			lines: {
				show: true
			},
			points: {
				show: true
			}
		},
		grid: {
			hoverable: true,
			clickable: true
		}
	});
}
