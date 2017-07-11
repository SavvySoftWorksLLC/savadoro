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
    if(duration._milliseconds < 0) {        stopTimer(countdown)
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

