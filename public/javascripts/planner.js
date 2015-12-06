$(document).ready(function() {
	$('#calendar').fullCalendar({
		aspectRatio: 2,
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		defaultDate : new Date(),
		selectable : true,
		selectHelper : true,
		select : function(start, end) {
			var title = prompt('Stage:');
			var eventData;
			if (title) {
				eventData = {
					title : title,
					start : start,
					end : end
				};
				$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
			}
			$('#calendar').fullCalendar('unselect');
		},
		editable : true,
		eventLimit : true, // allow "more" link when too many events
	    events: '/planner' ,
	    eventClick: function(calEvent, jsEvent, view)
        {
            var r=confirm("Delete " + calEvent.title);
            if (r===true)
            {
              $('#calendar').fullCalendar('removeEvents', calEvent._id);
          }
        }	    
	});

	$(function () {
        $("#createAppointmentForm").click(function () {
        	
        	var clientEvents = $('#calendar').fullCalendar( 'clientEvents');
        	console.log('events -> ' + clientEvents);
        	var jsonArray = [];
        	for (var i = 0; i < clientEvents.length; i++) {
        		var JSONObj = { "title":clientEvents[i].title, "start":clientEvents[i].start,"end":clientEvents[i].end };
        		jsonArray.push(JSONObj);
        	}
    		var dat = JSON.stringify(jsonArray);
            var url = '/planner';
            $.post("/planner",{events:dat},function(data, status){
    	        console.log("Data: " + data + "\nStatus: " + status);
    	    });
        });
    });											

});