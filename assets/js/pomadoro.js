$(function(){

	$.getJSON('assets/default.json', function(data) {
		for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
		$("#current-time").text('0:00');
		$("#current-session").text('None');
	});

  $('#start').on('click', function(e){
    e.preventDefault();
    var pomodoro = $("#pomodoro").val();
    console.log(pomodoro);
    $("#current-time").text(pomodoro);
    runTimer(pomodoro);
  });

  $("pause").on('click', function(e){
  	e.preventDefault();
  });

    $("reset").on('click', function(e){
  	e.preventDefault();
  	for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
  });
});


function runTimer(pomodoro) {
  var start = require("moment");
  var finish = start().add(pomodoro, "minutes");
  /** Code gets iffy here **/
  var moment = require("moment");
}
