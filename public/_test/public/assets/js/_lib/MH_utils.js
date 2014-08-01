//////************************************************************************
////// 이름:  MH_utis.js
////// 기능:  moonHani helper util class
//////************************************************************************
define(function (require) {
  "use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
  var $         = require('jquery');
  var _         = require('underscore');
  var Backbone  = require('backbone');
//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
  var modalTpl  = require('text!UI_tpl/UI-modal.html');
  var panelTpl  = require('text!UI_tpl/UI-panel.html');
  var downTpl  = require('text!UI_tpl/UI-down.html');
  var down2Tpl  = require('text!UI_tpl/UI-down2.html');

////===========================================================================
//// public methods & return
////===========================================================================
  return {
//-----------------------------------------------------------------------------
// date, time
//-----------------------------------------------------------------------------
/**
 * date 객체를 YYYYmmdd 형식 string으로 반환
 * @caution:
 * @param   object  date
 * @return  string  date[YYYYmmdd]
 */
    getDate: function(date) {
      var sYear = date.getFullYear();
      var sMonth = date.getMonth() + 1;
      var sDate = date.getDate();

      sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
      sDate  = sDate > 9 ? sDate : "0" + sDate;
      return sYear.toString() + sMonth.toString() + sDate.toString();
    },

/**
 * 오늘 날짜[local] date object 반환
 * @caution:
 * @param
 * @return  object  date
 */
    getToday: function() {
      return this.getDate(new Date());
    },

/**
 * 오늘 날짜[local] date object 반환
 * @caution: date[YYYYmmdd]에 plus일 후(-이면 전) 날짜 반환[YYYYmmdd]
 * @param   string date  기준일[YYYYmmdd]
 * @param   number plus  '-' : 이전
 * @return  object  date
 */
    getPlusDate: function(date, plus) {
      date = date.substr(0,4) + '/' + date.substr(4,2) + '/' + date.substr(6,2);
      var newDt = new Date(date);
      newDt.setDate( newDt.getDate() + plus );
      return this.converDateString(newDt, '');
    },

/**
 * date 객체를 YYYY[tag]mm[tag]dd 형식으로 반환
 * @caution: default tag : ''
 * @param   object  date  date 객체
 * @param   string  tag   YYYY, mm, dd 사이 구분 tag
 * @return  string  date  YYYY[tag]mm[tag]dd 형식
 */
    converDateString: function(date, tag) {
      var tag = tag || '';
      return date.getFullYear() + tag + this.addZero(eval(date.getMonth()+1)) + tag + this.addZero(date.getDate());
    },

//-----------------------------------------------------------------------------
// string
//-----------------------------------------------------------------------------
/**
 * 1, 2, 3, ... 99 -> 01, 02, 03, ... 99
 * @caution: !!!2자리에 대해서만 구현됨, 이후 임의 자리수에 대해 구현 예정
 * @param   number,string   i  1,2자리 숫자,문자
 * @return  string         앞에 0이 추가된 2자리 문자(숫자)
 */
    addZero: function(i) {
      var rtn = i + 100;
      return rtn.toString().substring(1,3);
    },

//-----------------------------------------------------------------------------
// json
//-----------------------------------------------------------------------------
/**
 * json 배열 a, b를 key를 기준으로 비교하여 add, del, upd를 반환
 * @caution: default key = 'id'
 * @param   json array   a    비교 대상 json array
 * @param   json array   b    비교 기준 json array
 * @param   string     key  비교 기준 key
 * @return  json object     {add:[], del:[], upd:[]}
 */
    compareJsonArr: function(a, b, key) {
      var key = key || 'id';  //primary key(uniq)

      var arrAdd = [];
      var arrDel = [];
      var arrUpd = [];

      _.each(a, function(unit) {
        if (!_.findWhere(b, unit)) {
          if (_.find(b, function(item){ return item[key] == unit[key]; })) {
            arrUpd.push(unit);
          } else {
            arrAdd.push(unit);
          }
        }
      });

      _.each(b, function(unit) {
        if (!_.find(a, function(item){ return item[key] == unit[key]; })) {
          console.log('key, b', key, unit[key]);
          arrDel.push(unit);
        }
      });

      return {add:arrAdd, del:arrDel, upd:arrUpd};
    },

/**
 * pick data in json array
 * @caution: for _syncPatientsMSMY
 * @param   json array   json   picked json array
 * @param   array    keys   picked keys
 * @return  json array      result json array
 */
    multiPick: function(options) {
      //var json = options.json || Patient.Patients.toJSON();
      var json = options.json;
      var keys = options.keys || ['id'];
      var picked = [];
      _.each(json, function(item) {
        //picked.push(_.pick(item, keys));  //'order'
        picked.push(_.pick(item, keys));  //'order'
      });
      console.log('client data', picked);
      return picked;
    },

//-----------------------------------------------------------------------------
// cookie
//-----------------------------------------------------------------------------
    //기능: 쿠키 생성
    setCookie: function(cName, cValue, cDay){
      var expire = new Date();
      expire.setDate(expire.getDate() + cDay);
      cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기 위해 escape(cValue) 시킴.
      if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
      document.cookie = cookies;
     },

    //기능: 쿠키 가져오기
    getCookie: function(cName) {
      cName = cName + '=';
      var cookieData = document.cookie;
      var start = cookieData.indexOf(cName);
      var cValue = '';
      if(start != -1) {
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
      }
      return unescape(cValue);
    },

    //기능: 쿠키 제거
    delCookie: function(cName) {
      var expire = new Date();

      //어제 날짜를 쿠키 소멸 날짜로 설정한다.
      expire.setDate(expire.getDate() - 1);
      document.cookie = cName + "= " + "; expires=" + expire.toGMTString() + "; path=/";
    },


//-----------------------------------------------------------------------------
// UI
//-----------------------------------------------------------------------------
/**
 * patientBrief
 * @caution:
 * @param   options      json
 * @return  $modal       jquery object
 */
    patientBrief: function(opts) {
      var strHtml = opts.NAME;

      if (opts.AGE) {
        strHtml += '(' + mH_getListAge(opts.AGE);
      }
      if (opts.SEX) {
        strHtml += '/' + mH_getListSex(opts.SEX) + ') ';
      }
      if (opts.LAST) {
        var LAST = mH_getListLast(opts.LAST, opts.LAST2);
        strHtml += '<span class="badge ' + LAST[1] + '">' + LAST[0] + '</span>';
      }
      if (opts.ITYPE) {
        var ITYPE = mH_getListItype(opts.ITYPE);
        strHtml += '<span class="badge ' + ITYPE[1] + '">' + ITYPE[0] + '</span>';
      }
      if (opts.JEJUCODE) {
        var JEJU = mH_getListJeju(opts.JEJUCODE);
        strHtml += '<span class="badge ' + JEJU[1] + '">' + JEJU[0] + '</span>';
      }
      return strHtml;
    },
/**
 * UI-modal
 * @caution: bootstrap.js / UI-modal.html
 * app.js : require(['jquery', 'backbone', 'bootstrap', 'app/router'], function ($, Backbone, bootstrap, Router)
 * @param   options      json
 * @return  $modal       jquery object
 */
    modal: function(options) {
      $('body .modal').remove();
      $('body').append($(_.template(modalTpl)()));
/*
      //require(['jquery', 'bootstrap-modal', 'bootstrap-modalmanager'], function ($) {
      require(['jquery', 'bootstrap'], function ($) {
        $('body .modal').modal('show');
      });
*/
      $('body .modal').modal('show');

      var $modal = $('body .modal');

      if (options.title) {
        $modal.find('.modal-title').html(options.title);
      }
      if (options.body) {
        $modal.find('.modal-body').html(options.body);
      }

      //return $('body .modal');
      return $modal;
      /*
      if (options.append) {
        //$panel.attr('id', options.id);
        $(options.append).append($modal);
      }
      */
    },

/**
 * UI-panel
 * @caution: bootstrap.js / UI-panel.html
 * @param   options      json
 * @return  $modal       jquery object
 */
    panel: function(options) {
      //console.log('panel@@@@@@@@@', $('#' + options.id).html());
      $('#' + options.id).remove();
      //console.log('panel removed@@@@@@@@@', $('#' + options.id).html());
      var $panel = $(_.template(panelTpl)());

      if (options.id) {
        $panel.attr('id', options.id);
      }
      if (options.class) {
        $panel.addClass(options.class);
      }
      if (options.heading) {
        $panel.find('.panel-heading').html(options.heading);
      }
      if (options.body) {
        $panel.find('.panel-body').html(options.body);
      }
      if (options.append) {
        //$panel.attr('id', options.id);
        //$(options.append).empty();
        $(options.append).append($panel);
      }

      //console.log('panel ', $panel.html());

      return $panel;

    },

/**
 * UI-down
 * @caution: dependence before DOM
 * @param   options      json
 * @return  $modal       jquery object
 */
    down: function(options) {
      //console.log('panel@@@@@@@@@', $(_.template(panelTpl)()));
      $('body .down').remove();
      var $down = $(_.template(downTpl)());

      if (options.id) {
        $down.attr('id', options.id);
      }
      if (options.class) {
        $down.addClass(options.class);
      }
      if (options.title) {
        $down.find('.down-title').html(options.title);
      }
      if (options.body) {
        $down.find('.down-body').html(options.body);
      }
      if (options.append) {
        $(options.append).append($down);
      }
      if (options.after) {
        $(options.after).after($down);
      }

      $down.find('.close').on('click', function(){
        console.log('down UI close');
        $down.remove();
      });

      return $down;
    },

/**
 * UI-down2
 * @caution: dependence before DOM / hide & show(ex: search Patient)
 * @param   options      json
 * @return  $modal       jquery object
 */
    down2: function(options) {
      //console.log('panel@@@@@@@@@', $(_.template(panelTpl)()));
      $('body .down').remove();
      var $down = $(_.template(down2Tpl)());

      if (options.id) {
        $down.attr('id', options.id);
      }
      if (options.class) {
        $down.addClass(options.class);
      }
      if (options.title) {
        $down.find('.down-title').html(options.title);
      }
      if (options.body) {
        $down.find('.down-body').html(options.body);
      }
      if (options.append) {
        $(options.append).append($down);
      }
      if (options.after) {
        //$(options.after).hide();
        //$(options.after).after($down);
        options.after.hide();
        //options.after.empty();
        options.after.after($down);
      }

      $down.find('.close').on('click', function(){
        console.log('down UI close');
        //$(options.after).show();
        options.after.show();
        $down.remove();
      });

      return $down;
    },


    _playAlarm: function() {
      $("#audio-player")[0].play();
      alert('playAlarm');
    },

    playAlarm: function() {
      alert('playAlarm######');
      var audio = new Audio('http://192.168.0.11/mH/_assets/audio/01.mp3');
      audio.play();
      /*
      console.log('playAlarm@@@@@@@@@@@');
      alert('playAlarm@@@@@@@@@@@');
      var audioElement = new Audio("");
      //document.body.appendChild(audioElement);
      //audioElement.src = 'http://192.168.0.11/mH/_assets/audio/01.mp3';
      audioElement.src = 'http://localhost/mH/_assets/audio/01.mp3';
      audioElement.id = "audioElement";
      audioElement.autoplay = true;
      //audioElement.play();
      */

    },

  }

/*
        var audioElement;
        audioElement = new Audio("");
        audioElement.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        document.body.appendChild(audioElement);
        audioElement.src = '../../data/audio/background.ogg';
        audioElement.id = "audioElement";

        audioElement.addEventListener('canplaythrough', function() {
            audioElement.play();
        }, false);

        audioElement.addEventListener('ended', function() {
            alert('ended');
        }, false);

        audioElement.onerror = function(event) {
           console.log(event.code);
        }
*/

});