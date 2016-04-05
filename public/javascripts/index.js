var socket=io.connect();
var channel;
var channels = [];
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
	console.log('init');
});

socket.on('initChannel', function(channel,i) {
	
	channels.push(channel);

//	if(channel.enable){
//		$('[data-toggle="channel'+i+'-toggle"]').parent().removeClass('toggle btn btn-default off');
//		$('[data-toggle="channel'+i+'-toggle"]').parent().addClass('toggle btn btn-default on');
//	}else{
//		$('[data-toggle="channel'+i+'-toggle"]').parent().removeClass('toggle btn btn-default on');
//		$('[data-toggle="channel'+i+'-toggle"]').parent().addClass('toggle btn btn-default off');
//	}
});

socket.on('waterData', function(v) {
	$('.legendProbeData').html('<small>Water : '+v.water+' °C </small> ');
	//console.log('water ' + v.water);
	var waterData = [];
	waterData.push(new Date().getTime(),v.water);
	water.push(waterData);
	
	replotGraph();
});

socket.on('meteoData', function(v) {

	$('.legendTempData').html('<small>Temp : '+v.temperature+' °C </small> ');
	//console.log('temperature ' + v.temperature);
	var waterData = [];
	waterData.push(new Date().getTime(),v.temperature);
	temp.push(waterData);

	$('.legendHumData').html('<small>Humd : '+v.humidity+' % </small> ');
	//console.log('humidity ' + v.humidity);
	var waterData = [];
	waterData.push(new Date().getTime(),v.humidity);
	humd.push(waterData);
	
	replotGraph();
});

socket.on('cpuData', function(v) {
	$('.cpuData').html('<small>Cpu : '+v.cpuData+' °C</small> ');
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
				show: false
			}
		},
		grid: {
			hoverable: true,
			clickable: true
		}
	});
}
