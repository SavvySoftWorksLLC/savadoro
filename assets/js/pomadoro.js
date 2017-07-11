const moment = require('moment');

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
    getSessions();
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




function getSessions() {
  var pomodoro = $('#pomodoro').val();
  var shortBreak = $('#short-break').val();
  var longBreak = $('#long-break').val();
  var sessionsNum = $('#sessions').val();
  var sessions = [['pomodor', 10], ['short break', 3], ['long break', 15], ['sessions', 4]];
  for (var i=0; i < sessions[3][1]; i++){
    console.log('butt')
  }
  for (var ii=0; ii < sessions[3][1]; ii++){
    console.log(sessions[0][0]);
    console.log(sessions[1][0]);
  }
}

function notify() {
  var notification = new Notification("Timer Stopped")
  notification
}

function stopTimer(countdown) {
  clearInterval(countdown)
}

function timer(time) {
  var duration = moment.duration(time)
  var interval = 1
  var countdown = setInterval(function () {
    duration = moment.duration(duration.asSeconds() - interval, 'seconds');
    if(duration._milliseconds > 0) {
      var time = moment(duration._milliseconds).format('mm:ss')
      $('#current-time').text(time)
      // $('#current-time').text(Math.round(duration.minutes()) + ':' + Math.round(duration.seconds()))
    }
    if(duration._milliseconds === 0) {
      $('#current-time').text('00:00')
      notify()
    }
    if(duration._milliseconds < 0) {
      stopTimer(countdown)
    }
  }, 1000)
  countdown
}

function runTimer(pomodoro) {
  var startTime = moment().valueOf();
  var pomoForRealDo = pomodoro * 60 * 1000
  var endTime = startTime + pomoForRealDo
  var diff = moment(pomoForRealDo).format("mm:ss")
  $("#current-time").text(diff);
  timer(pomoForRealDo)
}

