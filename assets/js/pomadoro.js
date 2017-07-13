const moment = require('moment');

var currentSession = 1;
var stage = 1;

$(function(){

	$.getJSON('assets/default.json', function(data) {

		for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
		$("#current-time").text('0:00');
		$("#current-session").text('0');
    window.onchange=getSessionInfo;
	});



  $('#start').on('click', function(e){
    e.preventDefault();
    savadoro();
    var pomodoro = $("#pomodoro").val();
    runTimer(pomodoro);
  });

  $("#pause").on('click', function(e){
  	e.preventDefault();
  });

    $("#reset").on('click', function(e){
  	e.preventDefault();
  	for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
  });
});

function getSessionInfo() {
  var pomodoro = $('#pomodoro').val();
  var shortBreak = $('#short-break').val();
  var longBreak = $('#long-break').val();
  var sessionsNum = $('#sessions').val();
  var sessions = {'pomodoro': pomodoro, 'short break': shortBreak, 'long break': longBreak,
   'sessions': sessionsNum};
  return sessions;
}

function savadoro() {
  var sessionsInfo = getSessionInfo();
  var pomodoroLength = sessionsInfo['pomodoro']
  var shortBreakLength = sessionsInfo['short break']
  var longBreakLength = sessionsInfo['long break']
  var sessionLength = sessionsInfo['sessions'];
  if(stage === 1) {
    runTimer(pomodoroLength)
    stage = 2
  } else if ((stage === 2) && (currentSession != sessionLength)) {
    runTimer(shortBreakLength)
    stage = 1
    currentSession++
  } else {
    runTimer(longBreakLength)
    currentSession = 1
    stage = 1
  }
}

function runPomodoro(pomodoroTime) {
  runTimer(pomodoroTime);
}

function changeSession(){
  var currentSession = $("#current-session").val();
  currentSession = currentSession + 1;
  var totalSessions = $('#sessions').val();
  $("#current-session").text(currentSession);
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
    if(duration._milliseconds > -1) {
      var time = moment(duration._milliseconds).format('mm:ss')
      $('#current-time').text(time)
      // $('#current-time').text(Math.round(duration.minutes()) + ':' + Math.round(duration.seconds()))
    }
    if(duration._milliseconds === 0) {
      notify()
      stopTimer(countdown)
      $('#current-time').text('00:00')

    }
  }, 1000)
  countdown
}

function runTimer(pomodoro) {
  changeSession();
  var startTime = moment().valueOf();
  var pomoForRealDo = pomodoro * 60 * 1000
  var endTime = startTime + pomoForRealDo
  var diff = moment(pomoForRealDo).format("mm:ss")
  $("#current-time").text(diff);
  timer(pomoForRealDo)
}

