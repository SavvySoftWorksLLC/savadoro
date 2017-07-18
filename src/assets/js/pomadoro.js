const moment = require('moment');

var currentSession = 1;
var stage = 1;
var notPaused = true;
var currentProgress = 0;

$(function(){
  setDefaults();

  $('#start-app').on('click', function(){
    $('.start-overlay-div').addClass('hide');
    savadoro();
  });

  $('#pause-app').on('click', function() {
    notPaused = true;
    $('.pause-overlay-div').addClass('hide');

  });

  $(".timer").on('click', function(e){
  	e.preventDefault();
    if(notPaused == true) {
      notPaused = false;
      $('.pause-overlay-div').removeClass('hide');
      console.log('butts');
    } else {
      notPaused = true;
      $('.pause-overlay-div').addClass('hide');
      console.log('feets');
    }
  });

  $("#reset").on('click', function(e){
    e.preventDefault();
    setDefaults();
    currentSession = 1
    stage = 1
  });

  $("#clear").on('click', function(e){
    e.preventDefault();
    setDefaults();
  })

  $('#info-icon').on('click', function(){
    if($('.info-div').hasClass('hide')) {
      $('.info-div').removeClass('hide');
    } else if (!$('.info-div').hasClass('hide')) {
      $('.info-div').addClass('hide');
    }
  });

  $('#info-close').on('click', function(){
    $('.info-div').addClass('hide');
  });

  $('#settings-icon').on('click', function(){
    if($('.settings-div').hasClass('hide')) {
      $('.settings-div').removeClass('hide');
    } else if (!$('.settings-div').hasClass('hide')) {
      $('.settings-div').addClass('hide');
    }
  });

  $('#settings-close').on('click', function(){
    $('.settings-div').addClass('hide');
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

  var progressBarTotal = (pomodoroLength * sessionLength) + (shortBreakLength * (sessionLength - 1))
  console.log(pomodoroLength * sessionLength)
  console.log(shortBreakLength * (sessionLength -1))
  console.log(progressBarTotal)

  if(stage === 1) {
    runTimer(pomodoroLength)
    progressBar(pomodoroLength, progressBarTotal)
    $("#current-session").text("Pomodoro " + currentSession);
    stage = 2
  } else if ((stage === 2) && (currentSession != sessionLength)) {
    runTimer(shortBreakLength)
    progressBar(shortBreakLength, progressBarTotal)
    $("#current-session").text("Short Break " + currentSession);
    stage = 1
    currentSession++
  } else {
    runTimer(longBreakLength)
    $("#current-session").text("Long Break");
    currentSession = 1
    stage = 1
  }
}

function progressBar(time, progressBarTotal) {
  currentProgress = currentProgress + parseFloat(time)
  var current = Math.round((currentProgress/progressBarTotal)*100) + "%"
  console.log(current)
  $('.savadoro--progress').css('width', current)
}

function notify() {
  var notification = new Notification("Timer Stopped")
  notification
}

function stopTimer(countdown) {
  clearInterval(countdown)
  $('#start').prop("disabled",false);
  $('#start').removeClass('start-disabled');
}

function timer(time) {
  var duration = moment.duration(time)
  var interval = 1
  var countdown = setInterval(function () {
    if(notPaused == true) {
      duration = moment.duration(duration.asSeconds() - interval, 'seconds');
      if(duration._milliseconds > -1) {
        var time = moment(duration._milliseconds).format('mm:ss')
        $('#current-time').text(time)
      }
      if(duration._milliseconds === 0) {
        notify()
        stopTimer(countdown)
        $('#current-time').text('00:00')
      }
    }
  }, 1000)
  countdown
  $('#reset').on('click', function() {
    setDefaults();
    stopTimer(countdown);
  });
}

function runTimer(pomodoro) {
  var startTime = moment().valueOf();
  var pomoForRealDo = pomodoro * 60 * 1000
  var endTime = startTime + pomoForRealDo
  var diff = moment(pomoForRealDo).format("mm:ss")
  $("#current-time").text(diff);
  timer(pomoForRealDo)
}

function setDefaults() {
  var sessionData = {
    "pomodoro": 25,
    "short-break": 5,
    "sessions": 4,
    "long-break": 15
  }
  for(var i in sessionData) {
    $('input[name="'+ i +'"]').val(sessionData[i]);
  }
  $("#current-time").text('0:00');
  $("#current-session").text('N/A');
  window.onchange=getSessionInfo;
};
