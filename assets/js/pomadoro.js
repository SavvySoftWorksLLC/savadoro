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
  const moment = require('moment');
  var startTime = moment().valueOf();
  var pomoForRealDo = pomodoro * 60 * 1000
  console.log(pomoForRealDo)
  var endTime = startTime + pomoForRealDo
  console.log(endTime)
  var diff = moment(pomoForRealDo).format("mm:ss")
  console.log(diff)
  $("#current-time").text(diff);
  // var startTimeFormatted = startTime.format("h:mm:ss")
  // var endTime = startTime.add(pomodoro, "minutes");
  // var endTimeFormatted = endTime.format("h:mm:ss")


  /** Code gets iffy here **/
  //var moment = require("moment");
}

