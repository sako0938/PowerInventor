var red = "rgb(255, 0, 0)";
var green = "rgb(0, 128, 0)";
var blue = "rgb(20, 23, 204)";

function GetRelayStatus() {
	setTimeout(function() {GetRelayStatus(); }, 5000);

	dataToSend = {};
			urlToSend = "/GetRelayStatus";
			$.ajax({ 
				type: "GET",
				url: urlToSend,
				data: dataToSend,
				dataType: "json"
			}).done(function(data) {
				$('#debug_string').text("Finished");
				// alert("relay1: " + data["relay1"] + " relay2: " + data["relay2"] + " relay3" + data["relay3"] + " relay4: " + data["relay4"]);
				if(data["relay1"] == 1) {
					$('.status#relay1').css('background-color',green);
				}
				else {
					$('.status#relay1').css('background-color',red);
				}
				if(data["relay2"] == 1) {
					$('.status#relay2').css('background-color',green);
				}
				else {
					$('.status#relay2').css('background-color',red);
				}
				if(data["relay3"] == 1) {
					$('.status#relay3').css('background-color',green);
				}
				else {
					$('.status#relay3').css('background-color',red);
				}
				if(data["relay4"] == 1) {
					$('.status#relay4').css('background-color',green);
				}
				else {
					$('.status#relay4').css('background-color',red);
				}
			});
}

$(document).ready(function() {
	GetRelayStatus();

	$("#toggle-relay").click(function(e) {
		$("#debug_string").html("Clicked");
		relaynum = 0
		toggledir = -1

		device = $(".device.status.selected").text();
		$("#relay-controls").find(".check-relay").each(function(index) {
			if($(this).prop("checked") == true) {
				console.log($(this).val());
				relaynum = $(this).val()
			} 
		})
		$("#relay-controls").find(".radio-relay").each(function(index) {
			if($(this).prop("checked") == true) {
				console.log($(this).val());
				toggledir = $(this).val()
			} 		
		})
		dataToSend = {'devname': device,'relay': relaynum, 'val': toggledir };
		urlToSend = "/SetRelay";
		alert("alive")
		$.ajax({ 
			type: "GET",
			url: urlToSend,
			data: dataToSend,
			dataType: "json"
		}).done(function(data) {
			$('#debug_string').text("Finished");
		});
		// e.preventDefault();
	});
	$("#add-to-schedule").click(function(e) {
		$("#debug_string").html("Clicked");
		device = $(".device.status.selected").text();
		relaynum = 0
		toggledir = -1
		remove = $(".check-remove").prop("checked")
		$("#relay-controls").find(".check-schedule").each(function(index) {
			if($(this).prop("checked") == true) {
				console.log($(this).val());
				relaynum = $(this).val()
			} 
		})
		$("#relay-controls").find(".radio-schedule").each(function(index) {
			if($(this).prop("checked") == true) {
				console.log($(this).val());
				toggledir = $(this).val()
			} 		
		})
		console.log($('#in_hour_sch').val())
		console.log($('#in_min_sch').val())
		if(remove == true) {
			dataToSend = {'devname': device, 'hour':$("#in_hour_sch").val(),'minute':$("#in_min_sch").val() };
			urlToSend = "/RemoveTask";
			$.ajax({ 
				type: "GET",
				url: urlToSend,
				data: dataToSend,
				dataType: "json"
			}).done(function(data) {
				
				$('#debug_string').text("Finished");
			});
			// e.preventDefault();
		}
		else {
			dataToSend = {'devname': device, 'relay': relaynum, 'val': toggledir,'hour':$("#in_hour_sch").val(),'minute':$("#in_min_sch").val() };
			urlToSend = "/AddTask";
			$.ajax({ 
				type: "GET",
				url: urlToSend,
				data: dataToSend,
				dataType: "json"
			}).done(function(data) {
				$('#debug_string').text("Finished");
			});
			// e.preventDefault();		
		}

	});
	$("#check-schedule").click(function(e) {
		$("#debug_string").html("Clicked");
		device = $(".device.status.selected").text();
		console.log("getting schedule for " + device);
		dataToSend = {"devname":device};
		urlToSend = "/PrintSchedule";
		$.ajax({ 
			type: "GET",
			url: urlToSend,
			data: dataToSend,
			dataType: "html"
		}).done(function(data) {
			$('#schedule-list').empty();
			$('#debug_string').text("Finished");
			// $.each(data,function(key,val){
			// 	$('#schedule-list').append("<p>"+val+"</p>")
			// })
			$("#schedule-list").append(data)
			
		});
		// e.preventDefault();
	});
	$("#get-status").click(function(e) {
		GetRelayStatus();
	});
	$("#show-devices").click(function(e) {
		$("#debug_string").html("Clicked");
		$("#relay-status").hide();
		$("#relay-controls").hide();
		$("#sensor-data").hide();

		dataToSend = {};
		urlToSend = "/ShowDevices";
		$.ajax({ 
			type: "GET",
			url: urlToSend,
			data: dataToSend,
			dataType: "json"
		}).done(function(data) {
			console.log(data)
			$("#devlist").empty();
			$("#debug_string").text("Finished");
			$.each(data,function(key,val){
				$("#devlist").append("<div class=\"status device\">"+key+"</div><br/>")
			})
		});
		});
	$("div.status.device:not(.selected)").live("click",function(e) {
		$("div.status.device").css("background-color",red);
		$(this).css("background-color",blue);
		console.log("clicked");
		$("#select-device-btn").show();
	});
	$("#select-device-btn").click(function() {
		$("div.status.device").each(function(index) {
			if($(this).css("background-color") == blue) {
					$(this).css("background-color",green);
					$(this).addClass("selected");

					dataToSend = {"name":$(this).text()};
					urlToSend = "/SelectDevice";
					$.ajax({ 
						type: "GET",
						url: urlToSend,
						data: dataToSend,
						dataType: "json"
					}).done(function(data) {
						GetRelayStatus()
						$("div.status.device:not(.selected)").remove();
						$("#relay-status").show();
						$("#relay-controls").show();
						// $("#sensor-data").show();
						$("#select-device-btn").hide();

					});
			}
		});
	});
	$('.check-relay').on('change', function() {
    	$('.check-relay').not(this).prop('checked', false);  
	});
	$('.radio-relay').on('change', function() {
    	$('.radio-relay').not(this).prop('checked', false);  
	});
	$('.check-schedule').on('change', function() {
    	$('.check-schedule').not(this).prop('checked', false);  
	});
	$('.radio-schedule').on('change', function() {
    	$('.radio-schedule').not(this).prop('checked', false);  
	});
	// $("#relay-status").hide();
	// $("#relay-controls").hide();
	// $("#sensor-data").hide();
	// $("#select-device-btn").hide();
});