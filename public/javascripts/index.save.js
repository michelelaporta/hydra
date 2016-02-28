var socket=io.connect(), d1=[], d5=[],  zone_delta=(new Date()).getTimezoneOffset()*60000;	// time diff in ms
var interval,limit=2880; // show 2 hours data (86400/5) at interval=5sec

socket.on('liveStream', function(url) {
	  console.log('on liveStream');
    $('#stream').attr('src', url);
    $('.start').hide();
  });

function startStream() {
	console.log('startStream');
	socket.emit('start-stream');
	$('.start').hide();
}

socket.on('setint', function(v) {
	if (!isNaN(v)) {
		console.log('got setint');
		$('#update_int_lbl').text(v);
		$('#update_int').slider('option', 'value', v);
	}
});
  
socket.on('initialization', function(v) {

	console.log('got initialization ' + v);
	interval=v.interval;
	limit=v.limit;
	$('#update_int_lbl').text(interval);
	$('#update_int').slider('option', 'value', interval);

	var mode = $('[data-toggle="mode-toggle"]').parent();
	mode.removeClass('toggle btn btn-default off') ;
	mode.addClass('toggle btn btn-default on') ;
	
//	$('#lights').bootstrapSwitch('toggleDisabled');
//	$('#fans').bootstrapSwitch('toggleDisabled');
	$('#lights').bootstrapToggle('disable');
	$('#fans').bootstrapToggle('disable');

	var lights = $('[data-toggle="lights-toggle"]').parent();
	var fans = $('[data-toggle="fans-toggle"]').parent();
	
	if(v.lights)
	{
		lights.removeClass('toggle btn btn-default off') ;
		lights.addClass('toggle btn btn-default on') ;
	}
	else
	{
		lights.removeClass('toggle btn btn-default on') ;
		lights.addClass('toggle btn btn-default off') ;
	}
	
	if(v.fans)
	{
		fans.removeClass('toggle btn btn-default off') ;
		fans.addClass('toggle btn btn-default on') ;
	}
	else
	{
		fans.removeClass('toggle btn btn-default on') ;
		fans.addClass('toggle btn btn-default off') ;
	}
});


socket.on('meteo', function(v) {
	var ts=v[0]-zone_delta;
	d1.push([ts, v[1]]);	
	d5.push([ts, v[2]]);	
	//d15.push([ts, v[3]]);	
	//re_flot();
	console.log('meteo data TEMP:' +v[1]+'°C HUM:'+ v[2]+'%');
	
	var i=1;
	$('.legend').html('<p><strong>Temp:</strong> '+v[1]+'</p><p><strong>Hum:</strong> '+ v[2]);
	});
//	$('#legend').find('tr').each(function() {
//		$(this).append('<td class="last_val">'+v[i++]+'</td>');
//	});
//});

socket.on('water', function(v) {
	console.log('water data ' +v);
	$('.legendWaterData').html('<p><strong>Temp:</strong> '+v[1]["water"]);
});

socket.on('water2', function(v) {
	console.log('water2 data ' +v);
	$('.legendWater2Data').html('<p><strong>Temp:</strong> '+v[1]["water2"]);
});

socket.on('light', function(v) {
	console.log('light data ' +  v[1]);
	$('.lightWaterData').html('<p><strong>Lux:<strong>'+v[1]["light"]+'</p>');
});

$(function() {
    $('#fans').bootstrapToggle();
    $('#lights').bootstrapToggle();
    $('#mode').bootstrapToggle();
});

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
    $('#mode').change(function() {
    	checked =  $(this).prop('checked');
    	console.log('mode ' + checked);
    	if(checked)
    	{
    		$('#lights').bootstrapToggle('disable');
    		$('#fans').bootstrapToggle('disable');
    	}
    	else
    	{
    		$('#lights').bootstrapToggle('enable');
    		$('#fans').bootstrapToggle('enable');
    	}
    	socket.emit('mode', {status: checked});
    });
});

