const moment = require('moment');

var currentSession = 1;
var stage = 1;
var notPaused = true;
var isLongBreak = false;
var currentProgress = 0;
var restartMeUp = { };

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

  $('#pause-current').on('click', function() {
    notPaused = false;
    $('.pause-overlay-div').removeClass('hide');
    optionsReturn()
  });

  $(".timer").on('click', function(e){
    if(notPaused == true) {
      notPaused = false;
      $('.pause-overlay-div').removeClass('hide');
    } else {
      notPaused = true;
      $('.pause-overlay-div').addClass('hide');
    }
  });

  $('#continue-app').on('click', function(){
    $('.continue-overlay-div').addClass('hide')
    savadoro()
  })

  $('#complete-app').on('click', function(){
    $('.complete-overlay-div').addClass('hide');
    $('.start-overlay-div').removeClass('hide');
  })

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

  $('.settings-toggle').on('click', function(e){
    e.preventDefault()
    toggleSettings()
  });

  $(".input-field").on('focusout', function(){
    var id = $(this).attr('id');
    validateSettingsInput(id);
  })
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

  var segments = []
  var p = parseFloat(pomodoroLength)
  var b = parseFloat(shortBreakLength)
  for(var i = 0; i < sessionLength; i++){
    if(i === (sessionLength - 1)) {
      segments[i] = p
    } else {
      segments[i] = p+b
    }
  }

  if(stage === 1) {
    runTimer(pomodoroLength)
    progressBar(pomodoroLength, progressBarTotal, segments)
    // $("#current-session").text("Pomodoro " + currentSession);
    $('#top').removeClass('bkg-img')
    $('#top').removeClass('bkg-img-long')
    stage = 2
    restartInfo(pomodoroLength, currentSession, stage)
  } else if ((stage === 2) && (currentSession != sessionLength)) {
    runTimer(shortBreakLength)
    progressBar(shortBreakLength, progressBarTotal, segments)
    // $("#current-session").text("Short Break " + currentSession);
    $('#top').addClass('bkg-img')
    stage = 1
    currentSession++
    restartInfo(shortBreakLength, currentSession, stage)
  } else {
    runTimer(longBreakLength)
    $('#top').addClass('bkg-img-long')
    // $("#current-session").text("Long Break");
    isLongBreak = true;
    currentSession = 1
    stage = 1
  }
}

function restartInfo(time, session, stage) {
  restartMeUp = {
    'time': time,
    'session': session,
    'stage': stage
  }
}

function progressBar(time, progressBarTotal, segments) {
  currentProgress = currentProgress + parseFloat(time)
  var current = -currentProgress
  var past = progressBarTotal - current

  var chart = c3.generate({
    data: {
      columns: [
        ['total', past],
        ['complete', current],
      ],
      colors:{
        total: '#3270A0',
        complete: '#FB4D3D'
      },
      type : 'donut'
    },
    legend: {
      show: false
    },
    donut: {
      label: {
        show: false
      },
      width: 8,
      axis: {
        y: {
          inverted: true
        }
      }
    }
  })

  var segmentChart = c3.generate({
    data: {
      json: segments,
      colors: 'transparent',
      type : 'donut'
    },
    legend: {
      show: false
    },
    donut: {
      label: {
        show: false
      },
      width: 8,
      axis: {
        y: {
          inverted: true
        }
      }
    },
    bindto: '#segment-chart'
  })
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

function timer(time, pomodoro) {
  var duration = moment.duration(time)
  var interval = 1
  var countdown = setInterval(function () {
    if(notPaused == true) {
      duration = moment.duration(duration.asSeconds() - interval, 'seconds');
      if(duration._milliseconds > -1) {
        var time = moment(duration._milliseconds).format('mm:ss')
        $('#current-time').text(time)
      }
      if(duration._milliseconds < 0) {
        notify()
        stopTimer(countdown)
        $('#current-time').text('00:00')
        if(isLongBreak) {
          $('.complete-overlay-div').removeClass('hide')
          isLongBreak = false
          currentProgress = 0
        } else {
          $('.continue-overlay-div').removeClass('hide')
        }

      }
    }
  }, 1000)
  countdown
  $('#reset').on('click', function() {
    setDefaults();
    stopTimer(countdown);
  });

  $('#restart-current').on('click', function() {
    stopTimer(countdown)
    currentSession = restartMeUp['session']
    stage = restartMeUp['stage']
    runTimer(restartMeUp['time'])
    optionsReturn()
  })

  $('#restart-savadoro').on('click', function() {
    stopTimer(countdown)
    currentProgress = 0
    currentSession = 1
    stage = 1
    optionsReturn()
    $('.start-overlay-div').removeClass('hide')
  })
}

function optionsReturn() {
  $('html, body').stop().animate({
    scrollTop: $('#top').offset().top
  }, 1000);
}

function runTimer(pomodoro) {
  var startTime = moment().valueOf();
  var pomoForRealDo = pomodoro * 60 * 1000
  var endTime = startTime + pomoForRealDo
  var diff = moment(pomoForRealDo).format("mm:ss")
  $("#current-time").text(diff)
  timer(pomoForRealDo, pomodoro)
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

// jQuery Scroll Animations
$('a[href^="#"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }
});

function validateSettingsInput(field) {
  var value = $('#' + field).val();
  if(field == 'pomodoro' || field == 'short-break' || field == 'long-break') {
    if(value < 0 || value.length <= 0) {
     $('#' + field).addClass('invalid');
     $('#save-settings').attr('disabled', 'disabled');
     $('.settings-toggle').off();
    } else {
      if($('#' + field).hasClass('invalid')){
        $('#' + field).removeClass('invalid');
        $('#save-settings').removeAttr('disabled');
        $('.settings-toggle').on('click', function(e){
          e.preventDefault();
          toggleSettings();
        });
      }
    }
  } else if(field == 'sessions') {
    if(value.length <= 0 || !Number.isInteger(parseFloat(value)) || value <= 0) {
     $('#' + field).addClass('invalid');
     $('#save-settings').attr('disabled', 'disabled');
     $('.settings-toggle').off();
    } else {
      if($('#' + field).hasClass('invalid')){
        $('#' + field).removeClass('invalid');
        $('#save-settings').removeAttr('disabled');
        $('.settings-toggle').on('click', function(e){
          e.preventDefault();
          toggleSettings();
        });
      }
    }
  }
};

function toggleSettings() {
 if($('.settings-div').hasClass('hide')) {
    $('.settings-div').removeClass('hide');
  } else if (!$('.settings-div').hasClass('hide')) {
    $('.settings-div').addClass('hide');
  }
}
