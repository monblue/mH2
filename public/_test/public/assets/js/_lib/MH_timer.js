define(function (require) {
    //"use strict";
////==========================================================
//// requires
////==========================================================
  var $           = require('jquery');
  var _           = require('underscore');
  var Backbone    = require('backbone');


////----------------------------------------------------
//code here
    ////private variables
    var intervals = []; //setInterval 이름
    var intvSec = 1;
    var uiPrefix = '#timer_';
    var initTime = '15:00';

    ////private functions
    //기능: countdown
    function countdown(i, cbEndTimer) {
      return function() {
        var remained = downTimer(i);  //timer Down
        if (remained < intvSec ) {
          //console('txAlarm@@@@', $("#audio-player").attr('id'));
          //alert($("#audio-player").attr('id'));
          //$("#audio-player")[0].play();
          clear(i)();
          cbEndTimer();

          //$("#txAlarm")[0].play();
          //alert('txAlarm####', $("#txAlarm"));
          //console('txAlarm@@@@', $("#audio-player").attr('id'));
          //alert($("#audio-player").attr('id'));
          //cbEndTimer();
          /*
          //alarm
          var oAudio = document.getElementById("txAlarm");
          //oAudio.src = "/haniMoon/assets/audio/" + bed + ".wav";
          //oAudio.src = "/mH/_assets/audio/02.wav";
          oAudio.src = "./_assets/audio/02.wav";
          oAudio.play();
          */
        }
      }
    }

    //기능: clearInterval
    function clear(i){
      return function() {
        clearInterval(intervals[i]);
      }
    }

    //기능: Start AND restart timer
    function startTimer(i, cbStartTimer, cbEndTimer){
      cbStartTimer();
      return function() {
        clear(i)();
        countdown(i, cbEndTimer)();
        intervals[i] = setInterval(countdown(i, cbEndTimer), intvSec*1000); //intvSec(초단위 interval)
      }

    }

    //기능: pause timer
    function pauseTimer(i, cbPauseTimer){
      cbPauseTimer();
      return function() {
        clear(i)();
        //$(uiPrefix + hM_putZeros(i, 2)).text(initTime);
      }
    }

    //intSec: sec 단위 interval
    function downTimer(i) {
      //var $ui = $(uiPrefix + addZero(i));
      var $ui = $(uiPrefix + i);
      var timer = $ui.text() || initTime;

      var min = parseInt(timer.split(':')[0]);
      var sec = parseInt(timer.split(':')[1]);
      if (sec == 0) {
        min--;
        sec = 60 - intvSec;
      } else {
        sec -= intvSec;
      }

      console.log('timer go on');

      $ui.text(addZero(min) + ":" + addZero(sec));
      return parseInt(min*60 + sec);
    }

    //min:sec 형식을 sec로 반환
    function getSec(min_sec) {
      minSec = min_sec.split(":");
      return parseInt(minSec[0])*60 + parseInt(minSec[1]);
    }

    //sec 형식을 min:sec로 반환
    function getStrTimer(sec) {
      interMin = parseInt(sec / 60);
      interSec = parseInt((sec - interMin*60)/intvSec)*intvSec;
      return addZero(interMin) + ":" + addZero(interSec);
    }

    function addZero(i) {
      var rtn = i + 100;
      return rtn.toString().substring(1,3);
    }

  var Timer = {
    ////global functions
    //타이머 시작
    startTimer: function(i, cbStartTimer, cbEndTimer) {
      startTimer(i, cbStartTimer, cbEndTimer)();
    },

    //타이머 중지
    pauseTimer: function(i, cbPauseTimer) {
      pauseTimer(i, cbPauseTimer)();
    },

    //모든 타이머 중지
    stopAll: function(i) {
      console.log('타이머가 중지되었습니다.');
      for(i in intervals) {
        clear(i)();
      }

    },

    //inervals [] 요소 갯수(타이머 갯수) 반환
    getTimerNum: function() {
      return intervals.length;
    },

    //타이머 세팅
    //intvSec: setInterval 시간 간격
    //uiPrefix: 타이머 ui selector 접두사(?)
    //initTime: 타이머 초기값
    setTimer: function(options) {
      intvSec = options.intvSec || 1;
      uiPrefix = options.uiPrefix || '#timer_';
      initTime = options.initTime || '15:00';
    },

    getSec: function(i) {
      //return getSec($(uiPrefix + addZero(i)).text());
      return getSec($(uiPrefix + i).text());
    },

    getStrTimer: function(sec) {
      return getStrTimer(sec);
    },

  };

  return Timer;
});