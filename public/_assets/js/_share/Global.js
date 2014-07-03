//////************************************************************************
////// 이름:    Global.js
////// 기능:    moonHani Chart Router Module
//////************************************************************************
define(function (require) {
  "use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
  //var $       = require('jquery');
  //var _       = require('underscore');
  var Backbone  = require('backbone');
  var MH      = require('MH_utils');

////===========================================================================
//// private properties
////===========================================================================

////===========================================================================
//// private methods
////===========================================================================

////===========================================================================
//// OBJECTS
////===========================================================================
  var Global = Backbone.Model.extend({
    url:"../_assets/json/env.json", //why './' not '../' "http://192.168.0.11/mH/assets/json/env.json"

    defaults:{
      _TODAY:'',    //오늘 날짜(서버 시스템 날짜 변경시에도 고정되도록.../)
      _LISTDATE:'',   //환자 목록일
      _CURPTID: '',  //편집중인 환자 차트 아이디
      _EDITDATE:'',   //차트 편집일
      _REFDATE:'',  //차트 참고일
      _BASEURL:'http://192.168.0.11/mH/', //API base url
      _TXSTATE:'진료대기',  //default state
      _RMSTATE:'대기', //대기(진료대기), 치료(치료대기/베드), 수납(수납대기), 완료(보험환자/일반환자)
      _TPLTAG:'WW', //
      _RUNTIME:true, //실시간 기능[true / false]
      _CHKINTV:10000, //체크 간격[checkUpdate 실행 간격]
      _MEDM:'0',  //
      _GWAM:'80', //진료과목?
      _FDOC:'D01',  //
      _LDOC:'D01',  //
      _BEDMAX:15,
      _USERID:'',   //사용자 아이디
      _USERNM:'',   //사용자 이름
      _USERLV:'',   //사용자 레벨[UI class에 적용 / 레벨이 낮으면 alert 중지, 아니면 실행]
      _PATH_IMG:'',   //path(photo / audio / movie // 진료 / 신상 / ...)
      //_TICK_SAVE:0,   //saveAll trigger용(0->1->0... change시 save(RC->IX->TX) trigger);
      _SAVEDRC:0, //0: 저장전, 1: 저장됨, -1: 저장요청, -2: 특이사항 저장(TX에서 필요한 데이터(보험약/비보험/예상 수납액?) 특이사항으로 전달받아야@@@)
      _SAVEDIX:0, //0: 저장전, 1: 저장됨, -1: 저장요청
      _SAVEDTX:0, //0: 저장전, 1: 저장됨, -1: 저장요청()
      _PREFEE:0,  //예상 수납액?
      _SU_ORDER:'' //수납시 지시사항(보험약/비보험...)
    },

    initialize: function() {
      //this.fetch({ url: this.url });
      //this.set('_LISTDATE', MH.getToday());
/*
      if (!date || !date.length) {
        date = MH.getToday();
      }
      this.set('_LISTDATE', date);
*/
      //console.log('here is Global ... list date is ', MH.getToday(), this.get('_LISTDATE'));

      this.fetch({
        //url: "./assets/json/env.json",
        url: this.url,
        async: false,
        success: function(data) {
          //console.log('data.toJSON()', data.toJSON());
        },
        error: function() {
          //console.log('this.GLOBAL.fetch error!!!');
        }
      });

      //console.log('Global is initialized', this.toJSON());

      //this.listenTo(this, 'change:_LISTDATE', this.changeListDate);
      //this.listenTo(this, 'change:_TXSTATE', this.changeTxState);
      this.listenTo(this, 'change:_RMSTATE', this.changeRmState);
      //this.listenTo(this, 'change:_RUNTIME', this.changeRunTime);
    },

    setListDate: function(date) {
      this.set('_LISTDATE', date);
    },

    changeListDate: function() {
      //console.log('_LISTDATE is changed from', this.previous('_LISTDATE'), ' to ', this.get('_LISTDATE'));
      if (this.get('_TODAY') !== this.get('_LISTDATE')) {
        //this.set('_RUNTIME', false);  //@@@@@@@@@@@
      }
    },
/*
    changeRunTime: function() {
      //console.log('_RUNTIME is changed from', this.previous('_RUNTIME'), ' to ', this.get('_RUNTIME'));
      if (this.get('_RUNTIME')) {
        //setInterval start
      } else {
        //setInterval stop
      }
    },

    changeTxState: function() {
      switch(this.get('_TXSTATE')) {
      case '진료대기':
        this.set('_TPLTAG', 'WW');
        break;
      case '치료대기':
        this.set('_TPLTAG', 'TR');
        break;
      case '치료베드':
        this.set('_TPLTAG', 'TR');
        break;
      case '수납대기':
        this.set('_TPLTAG', 'RW');
        break;
      case '보험환자':
        this.set('_TPLTAG', 'RD');
        break;
      case '일반환자':
        this.set('_TPLTAG', 'RD');
        break;
      }

      //console.log('this is Global... _TXSTATE changed ');

    },
*/
    changeRmState: function() {
      switch(this.get('_RMSTATE')) {
      case '대기':
        this.set('_TPLTAG', 'WW');
        break;
      case '치료':
        this.set('_TPLTAG', 'TR');
        break;
      /*
      case '수납':
        this.set('_TPLTAG', 'RW');
        break;
      */
      case '완료':
        this.set('_TPLTAG', 'RD');
        break;
      }

      //console.log('this is Global... _RMSTATE changed ');

    }

  });

//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  return new Global();
  //return Global;
});