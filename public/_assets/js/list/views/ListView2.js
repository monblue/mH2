//////************************************************************************
////// 이름:    List.js
////// 기능:    moonHani Chart.List Module
//////************************************************************************
define(function (require) {
  //"use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
  var $       = require('jquery');
  var _       = require('underscore');
  var Backbone  = require('backbone');
  var MH      = require('MH_utils');
  var MHTimer   = require('MH_timer');
  var GLOBAL    = require('share/Global');

//-----------------------------------------------------------------------------
// requires: models
//-----------------------------------------------------------------------------
  var Patient   = require('list/models/Patient');
//-----------------------------------------------------------------------------
// requires: views
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
  var headerTpl   = require('text!list_tpl/ListHeader.html');

  var itemTpls  = {
            "WW":require('text!list_tpl/ListItemWW.html'),
            "TR":require('text!list_tpl/ListItemTR.html'),
            "RD":require('text!list_tpl/ListItemRD.html')
            };
  var bedTpl    = require('text!list_tpl/List-assignBed.html');
  var detailTpl    = require('text!list_tpl/List-patientDetail.html');
  var photoTpl    = require('text!list_tpl/List-takePhoto.html');
  var carouselTpl    = require('text!list_tpl/List-takePhoto-carousel.html');

  var srhOuterTpl      = require('text!list_tpl/list-searchOuter.html');
  var srhInnerTpl      = require('text!list_tpl/list-searchInner.html');
  var moveStateTpl      = require('text!list_tpl/list-moveState.html');

////===========================================================================
//// private properties
////===========================================================================
  var $list    = $('#listSection');
  var UiId    = 'list';
  var panelOpts = {
      id: UiId,
      class: 'panel-info',
      append: '#listSection'
    };

  var $panel = '';
  var $modal;
  var $down;

  var ALARM = document.getElementById("audio-player");

  var runtimer  = false;   //setInterval runtime

////===========================================================================
//// private methods
////===========================================================================
//-----------------------------------------------------------------------------
// private methods:Header
//-----------------------------------------------------------------------------
/**
 * showList by state
 * @caution: _RMSTATE(view state) change ->
 */
  var _showList = function(state) {
    console.log('_showList!!!!!!!!!!');
    GLOBAL.set('_RMSTATE', state);
  };

/**
 * sort patient list
 * @caution: el(<a>) / child el(.badge) click 처리 (ex: nav-pills)
 */
  var _navAnchorBadge = function(e, attr) {
    console.log('_navAnchorBadge!!!!!!!!!!');
    if ($(e.target).attr(attr)) {
      $(e.target).parent().siblings('li').removeClass('active');
      $(e.target).parent().addClass('active');
      return $(e.target).attr(attr);
    } else {
      $(e.target).parent().parent().siblings('li').removeClass('active');
      $(e.target).parent().parent().addClass('active');
      return $(e.target).parent().attr(attr);
    }
  }

/**
 * Ajax : Sync Patient List Collection (MSSQL -> MYSQL -> Backbone)
 * @caution:
 */
  var _syncPatients = function() {
    console.log('_syncPatients!!!!!!!!!!');
    _syncPatientsMSMY();
    _syncPatientsMYBB();
  };

/**
 * Ajax : Sync MYSQL -> Backbone
 * @caution:
 * @return
 */
  var _syncPatientsMYBB = function() {
    console.log('_syncPatientsMYBB date:', GLOBAL.get('_LISTDATE'));
    $.ajax({
      dataType: 'json',
      async:false,
      url: GLOBAL.get('_BASEURL') + 'API/list/patients/' + GLOBAL.get('_LISTDATE'),
      success: function(res) {
        Patient.Patients.set(res);
      }
    });
  };

/**
 * Ajax : Sync MSSQL -> MYSQL
 * @caution: setInterval
 */
  var _syncPatientsMSMY = function() {
    console.log('_syncPatientsMSMY date:', GLOBAL.get('_LISTDATE'));
    $.ajax({
      dataType: 'json',
      async:false,
      url: GLOBAL.get('_BASEURL') + 'API/list/syncPatientsMSMY/' + GLOBAL.get('_LISTDATE'),
    });
  };

/**
 * setInverval / clearInterval
 * @caution: setInterval
 * @param   runTime  boolean    ex: GLOBAL.get('_RUNTIME')
 */
  var _runtime = function(runTime) {
    console.log('runtimer is', runTime);
    if (runTime) {
      console.log('runtimer is runnig!!!');
      _syncPatients();
      runtimer = setInterval(function() {GLOBAL.trigger('change:_LISTDATE'); }, GLOBAL.get('_CHKINTV'));
    } else {
      console.log('runtimer is stoped!!!');
      clearInterval(runtimer);
    }
  };

/**
 * sort patient list
 * @caution:
 */
  var _sortList = function(key, asc) {
    console.log('_sortList!!!!!!!!!!');
    bodyView.collection.comparator = function(patient) {
      if (asc) {
        return patient.get(key);
      } else {
        return -patient.get(key);
      }
    }

    bodyView.collection.sort();
  };

/**
 * _setSearchWords
 * @caution:
 */
    var _searchOuter = function(keyword) {
      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/list/searchPatient',
        type: 'post',
        async: false,
        data: keyword,
        dataType: 'json',
        success: function(res) {
          _showSearchOuter(res);
          //console.log('response ', res);
        }
      });
    }

/**
 * _setSearchWords
 * @caution:
 */
    var _setSearchWords = function(keyword) {
      //한글, 숫자, " " 외의 문자 제거, 공백문자는 1개로
      var keyword = keyword.replace(/[^가-힣\d\s]/g, "");
      keyword = keyword.replace(/(^\s*)|(\s*$)/gi, "").replace(/^\s{2,}/, " ");

      //검색어가 없거나 부적절한 문자 없앤 후 검색어가 없으면 종료
      if(!keyword) {
        console.log('검색어 없음');
        return false;
      }

      var arrSearch = keyword.split(' ');
      var name = '';
      var tel = ''
      var jumin = '';
      //이름검색(숫자 아닌 것), 전화번호 검색(숫자 4개 이하[전화번호 뒷자리]), 주민번호 검색(숫자 5개 이상[주민번호 앞자리])
      for (var k in arrSearch) {
        if (arrSearch[k].match(/^\D/)) {
          name = arrSearch[k];
        } else if (arrSearch[k].match(/^\d*$/) && arrSearch[k].length < 5) {
          tel = arrSearch[k];
        } else if (arrSearch[k].match(/^\d*$/) && arrSearch[k].length > 4) {
          jumin = arrSearch[k];
        } else {
        //
        }
      }

      console.log('{name: name, tel: tel, jumin: jumin}', {name: name, tel: tel, jumin: jumin});

      return {name: name, tel: tel, jumin: jumin};
    };

/**
 * _showSearchOuter
 * @caution:
 */
    var _showSearchOuter = function(patients) {
      $down = MH.down2({title:'검색 결과(접수용)', body:_.template(srhOuterTpl)({items:patients}), after:bodyView.$el});
      //bodyView.$el.hide();
      headView.$el.find('.dropdown-toggle').trigger( "click" );
      headView.$el.find('#np-searchOuter').val('');

      $down.find('.js-addPatient').on('click', function(e){
        var user = 'N01';  //!!!GLOBAL.get('_USERID')
        Patient.Patients.create({CHARTID:$(e.target).attr('id'), user:user}, {type: 'post', wait: true});
        console.log('js-addPatient clicked');
        $down.find('.close').trigger('click');
      });

    };

/**
 * _showSearchInner
 * @caution:
 */
    var _showSearchInner = function(patients) {
      $down = MH.down2({title:'검색 결과(내원환자)', body:_.template(srhInnerTpl)({items:patients}), after:bodyView.$el});
      //bodyView.$el.hide();
      headView.$el.find('.dropdown-toggle').trigger( "click" );
      headView.$el.find('#np-searchInner').val('');

    };

/**
 * _filterByKey
 * @caution:
 */
    var _filterByKey = function (collection, key, regex) {
      return _.filter(collection, function(obj){ return obj[key].match(regex);});
      //return _.filter(collection, function(obj){ return obj[key].match(/김/gi);});
    };

/**
 * _getStateNum
 * @caution:
 */
    var _getStateNum = function() {
        //var state = $(this).parent().attr('mH-state');
      var stateNum = {'진료대기':0,'치료대기':0,'치료베드':0,'수납대기':0,'보험환자':0,'일반환자':0};
      for(var st in stateNum) {
        if (Patient.Patients.where({KSTATE:st})) {
          stateNum[st] = Patient.Patients.where({KSTATE:st}).length;
        }
      }
      return stateNum;
    };
//-----------------------------------------------------------------------------
// private methods:Body(Item)
//-----------------------------------------------------------------------------
/**
 * _savePatientPhoto
 * @caution:
 */
    var _savePatientPhoto = function(options, $modal) {
      var id = options.id;
      var data = options.data;
      var rs = ''

      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/utils/upload.php/savePhoto/' + id,
        type: 'POST',
        data: data,
        processData: false,
        cache: false,
        async: false,
        contentType: false
      })
      .done(function (res) {
        $modal.find('[data-dismiss="modal"]').trigger('click');
        rs = res;
      })
      .fail(function () {
        //console.log('Error! An error occurred while uploading ');
        //    + photoFile.name + ' !' );
        return false;
      });

      return rs;
    };

/**
 * _showTakePhoto
 * @caution:
 */
    var _showTakePhoto = function(title, self) {
      $modal = MH.modal({title:title, body:_.template(photoTpl)()});
      var items = JSON.parse(self.model.get('PIC'));

      if (!items.length) {
        items = [
          {'name':'/photo/defaultPhoto1.jpg', 'caption':'테스트중1~'},
          {'name':'/photo/defaultPhoto2.jpg', 'caption':'테스트중2~'},
          {'name':'/photo/defaultPhoto3.jpg', 'caption':'테스트중3~'}
        ];
      } else {  //default 사진....
        _.each(items, function(item){
          item.name = '/photo/' + item.CAP_PATH;
          item.caption = '20' + item.CAP_WDATE + '/' + item.CAP_BIGO1 + '/' + item.CAP_REMARK
        });
      }

      $modal.find('#carousel').append('<div class="carousel slide" id="myCarousel"></div>');
      $modal.find('#myCarousel').html(_.template(carouselTpl)({items:items}));

      //console.log('modal-footer is removed', $modal.find('modal-footer').html());
      $modal.find('.modal-footer').remove();
      //console.log('modal-footer is removed', $modal.html());
      return $modal;
    };

/**
 * _takePhotoHandler
 * @caution:
 */
    var _takePhotoHandler = function($ui, self) {
      ////modal event handler
      //var self = this;
      //console.log('$ui@@@@@@@@', $ui.html());
      console.log('self@@@@@@@@', self.$el.html());
      var photoFile = '';

      $ui.find('#np-photo-file').on('change', function(){
        //console.log('phtofile changed', this.files[0]);
        var newFile = this.files[0];
        if ( !newFile.type.match(/image.*/i) ){
          alert('Insert an image!');
        } else {
          photoFile = newFile;
        }
        return false;
      });

      $ui.find('#modal-confirm').on('click', function(){
        if (photoFile) {
          // append photo into FormData object
          var formData = new FormData();

          formData.append('file', photoFile);
          formData.append('memo', $('#np-photo-memo').val());
          formData.append('uid', GLOBAL.get('_USERID')); //로그인 사용자 아이디에서 불러옴 ###
          formData.append('path', GLOBAL.get('_PATH_IMG')); //설정에서 불러옴 ###

          var id = self.model.get('CHARTID');
          var newPic = _savePatientPhoto({id:id, data:formData}, $ui);
          var oldPic = self.model.get('PIC');
          if (oldPic == '[]') { //첫사진
            newPic = '[' + newPic + ']';
          } else {  //사진 추가
            newPic = '[' + newPic + ',' + self.model.get('PIC').substring(1);
          }
          //self.model.set('PIC', newPic);
          self.model.save({CHARTID:id, PIC:newPic}, {patch: true});
        }
      });
    };

/**
 * _showTakePhoto
 * @caution: @@ return을 assignBed body html로 변경 예정
 */
    var _showAssignBed = function(title, self) {
      var items = [];
      for(var i=1;i<16;i++) { //@@@16 -> GLOBAL.get('_BEDMAX') + 1
        items.push(MH.addZero(i));
      }

      $down = MH.down({title:title, body:_.template(bedTpl)({items:items}), after:self.$el});

      _.each(_.pluck(_.where(Patient.Patients.toJSON(), {KSTATE:'치료베드'}), 'BNUM'), function(bed){
        $down.find('#bed_' + bed).prop('disabled', true).removeClass('btn-warning').addClass('btn-default');
      });

      return $down;
    };

/**
 * _assignBedHandler
 * @caution:
 */
    var _assignBedHandler = function($ui, self) {
      $ui.find('.js-saveBed').on('click', function(e){
        self.model.save({CHARTID:self.model.get('CHARTID'), BNUM:$(e.target).text(), BTIME:""}, {patch:true, wait: true});
        $ui.remove();
      });

      $ui.find('.close').on('click', function(e){
        $ui.remove();
      });
    }

/**
 * _saveTimer: timer 저장
 * @caution:
 */
    var _saveTimer = function(type, self) {
      var interval = MHTimer.getSec(self.model.get('BNUM')) || 600; //defaut interval
      var timerItem = self.$el.find('.timerItem').val() || 1; //defaut timerItem
      var timerIntv = self.$el.find('.timerIntv').val() || 10; //defaut timerIntv

      //server Update
      var options = {type: type, interval: interval, timerItem: timerItem, timerIntv: timerIntv};
      var rs;
      $.ajax({
        type: 'POST',
        //type:'GET',
        dataType: 'json',
        data: options,
        async:false,
        url: GLOBAL.get('_BASEURL') + 'API/list/saveTimer/' + GLOBAL.get('_LISTDATE') + '/' + self.model.get('CHARTID'),
        success: function(res) {
          //console.log('_saveTimer ajax respose', res);
          rs = res.TIMER;
           //Patient.Patients.set(res);
        }
      });
      //client Update
      //console.log('response', rs);
      return rs;
    };

/**
 * _setTimerUI:
 * @caution: @@@type 변경 예정: 'ST':'S', 'PS':'P', 'ED':'E' / btn-info, danger, success / li 수준 UI 변경 / code 최적화 예정
 */
    var _setTimerUI = function(type, self, opts) {

      if (opts.txTimer) {
        self.$el.find('.txTimer').text(opts.txTimer);
        self.$el.find('.timerItem').val(opts.timerItem);
        self.$el.find('.timerIntv').val(opts.timerIntv);
      }

      switch(type) {
      case 'ST':
        self.$el.find('.timerBtn').removeClass('glyphicon-play').addClass('glyphicon-pause');
        self.$el.find('.timerItem').prop('disabled', true);
        self.$el.find('.timerIntv').prop('disabled', true);
        self.$el.removeClass('timerE').addClass('timerS');
        break;
      case 'PS':
        self.$el.find('.timerBtn').removeClass('glyphicon-pause').addClass('glyphicon-play');
        self.$el.find('.timerItem').prop('disabled', false);
        self.$el.find('.timerIntv').prop('disabled', false);
        self.$el.removeClass('timerS').removeClass('timerE');
        break;
      case 'ED':
        self.$el.find('.timerBtn').removeClass('glyphicon-pause').addClass('glyphicon-play');
        self.$el.find('.timerItem').prop('disabled', false);
        self.$el.find('.timerIntv').prop('disabled', false);
        self.$el.removeClass('timerS').addClass('timerE');
        break;
      default:
        self.$el.find('.timerBtn').removeClass('glyphicon-play').addClass('glyphicon-pause');
        self.$el.find('.timerItem').prop('disabled', true);
        self.$el.find('.timerIntv').prop('disabled', true);
        break;
      }
    };

/**
 * _getInterval:
 * @caution: @@@
 */
    var _getInterval = function(strTime) {
      var rs;
          $.ajax({
            //type: 'POST',
            type:'GET',
            dataType: 'json',
            async:false,
            url: GLOBAL.get('_BASEURL') + 'API/list/getInterval/' + strTime,
            success: function(res) {
              ////console.log('_saveTimer ajax respose', res);
              rs = res;
            }
          });
      return rs;
    };

/**
 * _cbStartTimer: callback function for timer start
 * @caution: @@@
 */
    var _cbStartTimer = function(self, opts) {
      console.log('타이머가 시작되었습니다.');
      _setTimerUI('ST', self, opts);
      //ALARM.load();
      //setTimeout("_alarmPlay();",500);
    };

/**
 * _cbPauseTimer: callback function for timer pause
 * @caution: @@@
 */
    var _cbPauseTimer = function(self, opts) {
      console.log('타이머가 일시 정지되었습니다.');
      _setTimerUI('PS', self, opts);
    };

/**
 * _cbEndTimer: callback function for timer end
 * @caution: @@@
 */
    var _cbEndTimer = function(self, opts) {
      //$("#txAlarm")[0].play();
      console.log('시간이 다 되었습니다.');
      opts.txTimer = '00:00';
      opts.timerIntv = '00';
      _setTimerUI('ED', self, opts);

      //document.getElementById('audio-player').play();
      ALARM.play();

      //$("#audio-player")[0].play();

      //console.log('player', $("#audio-player").attr('id'));
      //alert($("#audio-player").attr('id'));
      //$("#audio-player")[0].play();
      //self.$el.find('audio')[0].play();
      //self.$el.find('audio').trigger('play');
      //self.$el.find('.js-playBell').trigger('click');
      //MH.playAlarm();

      //var oAudio = document.getElementById("txAlarm");
      //oAudio.src = "/haniMoon/assets/audio/" + bed + ".wav";
      //oAudio.src = GLOBAL.get('_BASEURL') + '_assets/audio/02.wav';
      //oAudio.src = GLOBAL.get('_BASEURL') + '_assets/audio/01.mp3';
      //oAudio.type = 'audio/mpeg';
      //oAudio.src = "./_assets/audio/02.wav";

      //oAudio.play();
    };

/**
 * _alarmPlay:
 * @caution: @@@@@TESTING
 */
    var _alarmPlay = function() {
      ALARM.pause();
      ALARM.play();
      alert("qq");
    };

      function _alarm() {
        ALARM.pause();
        ALARM.play();
      }

//-----------------------------------------------------------------------------
// private methods:Body
//-----------------------------------------------------------------------------

////===========================================================================
//// OBJECTS
////===========================================================================
//-----------------------------------------------------------------------------
// OBJECTS:PatientListHeader
//-----------------------------------------------------------------------------
  var PatientListHeader = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-pills',

    initialize: function() {
      //this.render();
      this.listenTo(GLOBAL, 'change:_LISTDATE', this.reList);
      this.listenTo(GLOBAL, 'change:_RUNTIME', this.runtime);
      this.listenTo(Patient.Patients, 'add', this.showStateNum);
      this.listenTo(Patient.Patients, 'remove', this.showStateNum);
      //!!!현재 UI state와 비교... 동일한 경우 UI 삭제/추가
      this.listenTo(Patient.Patients, 'change:KSTATE', this.showStateNum);
    },

    render: function() {
      //this.template = _.template(headerTpl);
      //this.$el.remove();
      //$('#listSection .panel-heading').empty();
      //this.$el.html(this.template());
      this.$el.html(_.template(headerTpl)());
      //$('#listSection .panel-heading').append(this.$el);
      this.showStateNum();
      return this;
      //$('#listSection .panel-heading').html(this.template());
    },

    events: {
      'click .js-showList': 'showList',
      'click .glyphicon-refresh': 'reList',
      'click .glyphicon-eye-open': 'onRuntime',
      'click .glyphicon-eye-close': 'offRuntime',
      'click .dropdown-menu': 'notClose',
      'change #js-sortList': 'sortList',
      'change #np-isAsc': 'sortList',
      //'change #np-isAsc': 'sortOrd',
      //'click .dropdown-menu select': 'notClose',
      'keypress #np-searchOuter': 'searchOuterByKey',
      'click #js-searchOuter': 'searchOuter',
      'keypress #np-searchInner': 'searchInnerByKey',
      'click #js-searchInner': 'searchInner'
    },

/**
 * sort patient list
 * @caution: el / child el(span.badge) click 처리
 */
    showList: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).parent().hasClass('active') && !$(e.target).parent().parent().hasClass('active')) {  //@@같은 버튼을 다시 누르는 경우는 제외
        _showList(_navAnchorBadge(e, 'mH-state'));
      }

    },

/**
 * reList: _syncPatients
 * @caution: //@@listenTo로 호출된 경우-Uncaught TypeError: Cannot read property 'preventDefault' of undefined
 */
    reList: function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      _syncPatients();
    },

/**
 * runtime: _syncPatients <- listenTo
 * @caution: runtime:  _runtime(GLOBAL.get('_RUNTIME')), <== NOT WORKING
 */
    runtime: function() {
      _runtime(GLOBAL.get('_RUNTIME'));
    },

/**
 * onRuntime: runtimer start
 * @caution:
 */
    onRuntime: function(e) {
      e.preventDefault();
      e.stopPropagation();
      _syncPatients();  //즉시 Sync 실행
      GLOBAL.set('_RUNTIME', true);
      $(e.target).removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
    },

/**
 * onRuntime: runtimer stop
 * @caution:
 */
    offRuntime: function(e) {
      e.preventDefault();
      e.stopPropagation();
      GLOBAL.set('_RUNTIME', false);
      //console.log('Global interval', GLOBAL.get('_RUNTIME'), GLOBAL.get('_CHKINTV'));
      $(e.target).removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
    },

/**
 * onRuntime: dropdown-menu 없어지지 않도록!!!
 * @caution:
 */
    notClose: function(e){
      //e.preventDefault();
      e.stopPropagation();
      //console.log('not Close');
    },

/**
 * sortList: dropdown-menu 없어지지 않도록!!!
 * @caution:
 */
    sortList: function(e){
      e.preventDefault();
      e.stopPropagation();

      _sortList(this.$el.find('#js-sortList').val(), this.$el.find('#np-isAsc').is(':checked'));
      this.$el.find('.dropdown-toggle').trigger( "click" );
    },

/**
 * searchOuterByKey: searchPatient: 환자 검색(접수) By Key
 * @caution:
 */
    searchOuterByKey: function(e) {
      e.stopPropagation();
      //e.preventDefault();
      if (e.keyCode === 13) {
        e.preventDefault();
        this.$el.find('#js-searchOuter').trigger('click');
      }
    },

/**
 * searchOuter: searchPatient: 환자 검색(접수) By Click
 * @caution:
 */
    //searchPatient: 환자 검색(접수)
    searchOuter: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var keyword = this.$el.find('#np-searchOuter').val();
      _searchOuter(_setSearchWords(keyword));
    },


/**
 * searchOuterByKey: searchPatient: 환자 검색(내원 환자 내) By Key
 * @caution:
 */
    searchInnerByKey: function(e) {
      e.stopPropagation();
      //e.preventDefault();
      if (e.keyCode === 13) {
        e.preventDefault();
        //this.$el.find('#js-srhPatient').trigger('click');
        //this.$el.find('[type="submit"]').trigger('click');
        this.$el.find('#js-searchInner').trigger('click');
      }
    },

/**
 * searchOuterByKey: searchPatient: 환자 검색(내원 환자 내) By Click
 * @caution:
 */
    searchInner: function(e) {
      e.stopPropagation();
      e.preventDefault();
      //console.log('keypress searchPatient');
      var keyword = this.$el.find('#np-searchInner').val();
      var patients = _filterByKey(Patient.Patients.toJSON(), 'NAME', RegExp(keyword, "gi"));
      console.log('result is', patients);
      _showSearchInner(patients);  //@@@@@상태, 바로 가기...@@@
    },

/**
 * searchOuterByKey: searchPatient: 환자 검색(내원 환자 내) By Click
 * @caution:
 */
    showStateNum: function() {
      var stateNum = _getStateNum();
      this.$el.find('span.stateNum').each(function(){
        var state = $(this).parent().attr('mH-state');

        switch(state) {
        case '대기':
          var num = stateNum['진료대기'];
          break;
        case '치료':
          var num = stateNum['치료대기'] +  stateNum['치료베드'];
          break;
        case '완료':
          var num = stateNum['수납대기'] + stateNum['보험환자'] +  stateNum['일반환자'];
          break;
        default:
          var num = 0;
          break;
        }

        $(this).text(num);

      });
    },

  });


//-----------------------------------------------------------------------------
// OBJECTS:PatientListItem
//-----------------------------------------------------------------------------
  var PatientListItem = Backbone.View.extend({
    tagName: 'li',
    className: 'patient-list-item',

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.close);
    },

    render: function() {
      this.$el.html(_.template(itemTpls[GLOBAL.get('_TPLTAG')])(this.model.toJSON()));
      if(this.model.get('TOTAL') > 0) {
        this.$el.addClass('mH-done');
      }

      if (this.model.get('KSTATE') == '치료베드') {
        this.initTimer();
      }

      return this;
    },

    events: {
      'click .js-takePhoto': 'takePhoto',
      'click .js-assignBed': 'assignBed',
      'click .js-showDetail': 'showDetail',
      'click .js-showChart': 'showChart', //@@chart용
      'click .glyphicon-play': 'startTimer',  //치료실 전용
      'click .glyphicon-pause': 'pauseTimer',  //치료실 전용
      'change .timerItem': 'changeTimerItem',   //치료실 전용@@@@@설정에서 mH-val 불러오기
      //'click .txTimer': 'setTimer', //치료실 전용
      'change .timerIntv': 'setTxTimer', //치료실 전용
      'click .js-moveState': 'moveState',  //치료실 전용
      'click .mH-ibtn': 'iBtnClick',   //iconButton Click
      'click .js-playBell': 'playBell'
    },

/**
 * close
 * @caution:
 */
    close: function() {
      ////console.log('model destroyed');
      this.$el.unbind();
      this.$el.remove();
    },

/**
 * showChart for chart @@@disabled for only list page
 * @caution:
 */
    showChart: function() {
      GLOBAL.set({_CURPTID:this.model.get('CHARTID'),
            _REFDATE:this.model.get('LASTDATE'),
            _EDITDATE:GLOBAL.get('_LISTDATE')});
      this.$el.siblings().removeClass('active');
      this.$el.addClass('active');
    },

/**
 * showDetail
 * @caution:
 */
    showDetail: function() {
      $modal = MH.modal({title:'상세 정보', body:_.template(detailTpl)(this.model.toJSON())});
    },

/**
 * takePhoto
 * @caution:
 */
    takePhoto: function() {
      $modal = _showTakePhoto('사진 찍기(' + this.model.get('NAME') + ')', this);
      console.log('takePhoto modal', $modal);
      _takePhotoHandler($modal, this);
    },

/**
 * assignBed: 대기(진료 대기)용
 * @caution: @@@이름 변경 예정
 */
    assignBed: function() {
      $down = _showAssignBed('베드 설정', this);
      _assignBedHandler($down, this);
    },

/**
 * moveState: 치료(치료실)용
 * @caution: @@@private methods
 */
    moveState: function(e) {
      //$down = _showMoveState('치료 종료 설정', this);
      //_moveStateHandler($down, this);

      console.log('moveState');
      $down = MH.down({title:'진료 단계 조정', body:_.template(moveStateTpl)(), after:this.$el});

      var self = this;
      $down.find('#js-roomOut').on('click', function(e){
        self.model.save({CHARTID:self.model.get('CHARTID'), KSTATE:'수납대기'}, {patch:true, wait: true});
        //console.log('퇴실되었습니다.');
        $down.find('.close').trigger('click');
      });

    },

/**
 * changeTimerItem: 치료(치료실) 타이머용
 * @caution:
 */
    changeTimerItem: function(e) {
      e.preventDefault();
      e.stopPropagation();
      //console.log('changeTimerItem is changed', $(e.target).find(':selected').attr('mH-val'));
      this.$el.find('.timerIntv').val($(e.target).find(':selected').attr('mH-val')).trigger('change');
    },

/**
 * setTxTimer: 치료(치료실) 타이머용:타이머 시간 설정
 * @caution: @@@ UI /data 분리 및 이름 변경 예정
 */
    setTxTimer: function(e) {
      //console.log('setTime', $(e.target).val());
      e.preventDefault();
      e.stopPropagation();
      var time = $(e.target).val() + ':00';
      this.$el.find('.txTimer').text(time);
    },

/**
 * startTimer: 치료(치료실) 타이머용:타이머 시작["ST:1:1397543462"]
 * @caution:
 */
    startTimer: function(e) {
      e.preventDefault();
      e.stopPropagation();

      //ALARM.load();
      //setTimeout("_alarm", 500);
      //setTimeout(function() {ALARM.play();alert('start...');}, MHTimer.getSec(this.model.get('BNUM'))*1000);

      if (this.model.get('KSTATE') == '치료베드') {
        //this.model.save({CHARTID:model.get('CHARTID'), TIMER:}, {patch:true, wait: true});
        var timer = _saveTimer('ST', this);
        var self = this;
        MHTimer.startTimer(this.model.get('BNUM'), function(){_cbStartTimer(self, {});}, function(){_cbEndTimer(self, opts);});
        this.model.set('TIMER', timer);
        _setTimerUI('ST', this, {});
      } else {
        alert('치료베드 환자가 아닙니다.');
      }

    },

/**
 * pauseTimer: 치료(치료실) 타이머용:타이머 일시 정지
 * @caution:
 */
    pauseTimer: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.model.get('KSTATE') == '치료베드') {
        var timer = _saveTimer('PS', this);
        var self = this;
        MHTimer.pauseTimer(this.model.get('BNUM'), function(){_cbPauseTimer(self, {});});
        //console.log('this.model.toJSON()', this.model.toJSON());
        this.model.set('TIMER', timer);
        _setTimerUI('PS', self, {});
        //"ST:1:1397543462"
      } else {
        alert('치료베드 환자가 아닙니다.');
      }
    },

/**
 * initTimer: 치료(치료실) 타이머용:'치료' 모든 타이머 시작 / '치료'외 모든 타이머 정지
 * @caution: @@@ 교정 예정!!!
 */
    initTimer: function() {
      if (!this.model.get('TIMER')) {
         //console.log('타이머가 설정되어 있지 않습니다.', this.model.get('TIMER')) ;
      } else {
        //console.log('타이머를 재설정합니다.', this.model.get('TIMER')) ;
        var bed = this.model.get('BNUM');
        var arrTimer = this.model.get('TIMER').split(':');
        var type = arrTimer[0];
/*
        if (!type) {
          return;
        }
*/
        var opts = {
              "txTimer": '00:00',
              "timerItem": arrTimer[1],
              "timerIntv": arrTimer[2]
        };

        switch(type) { ////@@@@@@@@
        case 'ST':  //StarT
          var interval = _getInterval(arrTimer[3]);
          //ED시킴
          if (interval < 1) {
            opts.timerIntv = '00';
            _setTimerUI('ED', this, opts);
            _saveTimer('ED', this);
            //return false;
          } else {
            opts.txTimer = MHTimer.getStrTimer(interval);
            _setTimerUI('ST', this, opts);
            //MHTimer.startTimer(bed, function(){}, function(){console.log('시간이 다 되었습니다.')});
            var self = this;
            MHTimer.startTimer(bed, function(){_cbStartTimer(self, {});}, function(){_cbEndTimer(self, opts);});
          }
          break;
        case 'PS':  //PauSe
          opts.txTimer = MHTimer.getStrTimer(parseInt(arrTimer[3]));
          _setTimerUI('PS', this, opts);
          break;
        case 'ED':  //EnD
          opts.timerIntv = '00';
          _setTimerUI('ED', this, opts);
          break;
        }

      }
    },

    playBell: function() {
      alert('play Bell');
      this.$el.find('audio').trigger('play');
      alert('play Bell2');
    }

  });

//-----------------------------------------------------------------------------
// OBJECTS:PatientList
//-----------------------------------------------------------------------------
  var PatientList = Backbone.View.extend({
    tagName: 'ul',
    className: 'patient-list',

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'remove', this.removeOne);
      this.listenTo(this.collection, 'sort', this.render);
      this.listenTo(GLOBAL, 'change:_RMSTATE', this.changeState);
      //this.listenTo(GLOBAL, 'change:_RUNTIME', this.runtime);
    },

    preRender: function() {
      $panel = MH.panel(panelOpts);
      $panel.find('.panel-heading').empty().append(headView.render().el);
    },

    render: function() {
      $panel.find('.panel-body').empty();
      this.$el.empty();
      this.collection.forEach(this.addOne, this);
      $panel.find('.panel-body').append(this.$el);
      this.$el.show();  //hide 됐을 때 대비@@@

    },

    addOne: function(patient) {
      this.$el.append(new PatientListItem({model:patient}).render().el);
    },

    removeOne: function(patient) {
      ////console.log('collection removed', patient.get('id'));
      patient.trigger('destroy');
    },

    changeState: function() {
      //e.preventDefault();
      //e.stopPropagation();
      //this.collection.trigger('reset'); //!!!render 2번 호출됨
      Patient.Patients.trigger('reset'); //!!!render 1번 호출됨
      if (GLOBAL.get('_RMSTATE') == '치료') {
        //console.log('치료실입니다. 타이머를 돌리세요...');
        _sortList('BNUM', true);  //@@@sort
      } else if (GLOBAL.get('_RMSTATE') == '대기') {
        MHTimer.stopAll();
        _sortList('JTIME', false);
        //console.log('치료실이 아닙니다. 타이머를 멈추세요...');
      } else if (GLOBAL.get('_RMSTATE') == '완료'){
        MHTimer.stopAll();
        _sortList('TOTAL', true);
      }
      //change sortKey
      //trigger sort
    },

  });

//-----------------------------------------------------------------------------
// INSTANCES
//-----------------------------------------------------------------------------
  var headView = new PatientListHeader();
  var bodyView = new PatientList({collection:Patient.PatientsSubset});

//-----------------------------------------------------------------------------
// RETURN
//-----------------------------------------------------------------------------
  return {
    headView: headView,
    bodyView: bodyView
  }

});