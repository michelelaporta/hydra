//var socket=io.connect('http://localhost:8000'), d1=[], d5=[],  zone_delta=(new Date()).getTimezoneOffset()*60000;	// time diff in ms
var socket=io.connect(), d1=[], d5=[],  zone_delta=(new Date()).getTimezoneOffset()*60000;	// time diff in ms
var interval,limit=2880; // show 2 hours data (86400/5) at interval=5sec

$(function() {
    $('#lights').bootstrapToggle();
});

socket.on('initialization', function(v) {
	
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
	var i=1;
	$('.legend').html('<p><strong>Temperature:</strong> '+v[1]+'</p><p><strong>Humidity:</strong> '+ v[1]);
	});
//	$('#legend').find('tr').each(function() {
//		$(this).append('<td class="last_val">'+v[i++]+'</td>');
//	});
//});

socket.on('water', function(v) {
	//console.log('newdata comes ' +v);
	var ts=v[0]-zone_delta;
	d1.push([ts, v[1]]);	
	//d15.push([ts, v[3]]);	
	//re_flot();	
	var i=1;
	$('.legendWaterData').html('<p><strong>Water Temperature:</strong> '+v[1]["water"]);
//	$('#legend').find('tr').each(function() {
//	$(this).append('<td class="last_val">'+v[i++]+'</td>');
//});
});

socket.on('light', function(v) {
	var ts=v[0]-zone_delta;
	d1.push([ts, v[1]]);	
	console.log('lightData ' +  v[1]);
	//d15.push([ts, v[3]]);	
	//re_flot();	
	var i=1;
	$('.lightWaterData').html('<p><strong>Light:</strong> '+v[1]["light"]);
});

$(function() {
    $('#lights').change(function() {
    	console.log('lights ' + $(this).prop('checked'));
    	socket.emit('lights', {status: $(this).prop('checked')});

    })
});


$(function() {
    $('#fans').bootstrapToggle();
});

$(function() {
    $('#fans').change(function() {
    	console.log('fans ' + $(this).prop('checked'));
    	socket.emit('fans', {status: $(this).prop('checked')});

    })
});

