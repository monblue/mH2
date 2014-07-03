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
  var headerTpl   = require('text!list_tpl/_/ListHeader.html');
  var bodyTpl = require('text!list_tpl/_/ListBody.html');
  var theadTpls   = {
            "WW":require('text!list_tpl/_/ListTheadWW.html'),
            "TR":require('text!list_tpl/_/ListTheadTR.html'),
            //"RW":require('text!list_tpl/_/ListTheadRW.html'),
            "RD":require('text!list_tpl/_/ListTheadRD.html')
            };

  var itemTpls  = {
            "WW":require('text!list_tpl/_/ListItemWW.html'),
            "TR":require('text!list_tpl/_/ListItemTR.html'),
            //"RW":require('text!list_tpl/_/ListItemRW.html'),
            "RD":require('text!list_tpl/_/ListItemRD.html')
            };
  var bedTpl    = require('text!list_tpl/_/List-assignBed.html');
  var detailTpl    = require('text!list_tpl/_/List-patientDetail.html');
  var photoTpl    = require('text!list_tpl/_/List-takePhoto.html');
  var carouselTpl    = require('text!list_tpl/_/List-takePhoto-carousel.html');

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

  var runtimer  = true;   //setInterval runtime




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
      //this.listenTo(GLOBAL, 'change:_RUNTIME', this.runtime);
      this.listenTo(Patient.Patients, 'add', this.fillStateNum);
      this.listenTo(Patient.Patients, 'remove', this.fillStateNum);
      //!!!현재 UI state와 비교... 동일한 경우 UI 삭제/추가
      this.listenTo(Patient.Patients, 'change:KSTATE', this.fillStateNum);
    },

    render: function() {
      this.template = _.template(headerTpl);
      //this.$el.remove();
      $('#listSection .panel-heading').empty();
      this.$el.html(this.template());
      ////console.log('!!!PatientListHeader rendering!!!!!!!!!!!');
      //$('#listSection').find('thead').append(new PatientListThead().render().el);
      $('#listSection .panel-heading').append(this.$el);
      this.fillStateNum();
      //$('#listSection .panel-heading').html(this.template());
    },

    events: {
      'click .js-showList': 'showList',
      'click .glyphicon-refresh': 'reList',
      'click .glyphicon-eye-open': 'onRuntime',
      'click .glyphicon-eye-close': 'offRuntime',
    },

    showList: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(e.target).attr('mH-state')) {
        //$('#listSection .panel-heading li').removeClass('active');
        $(e.target).parent().siblings('li').removeClass('active');
        $(e.target).parent().addClass('active');
        //GLOBAL.set('_TXSTATE', $(e.target).attr('mH-state'));
        GLOBAL.set('_RMSTATE', $(e.target).attr('mH-state'));
      } else {  //@@@@child el(span.badge) click
        //$('#listSection .panel-heading li').removeClass('active');
        $(e.target).parent().parent().siblings('li').removeClass('active');
        $(e.target).parent().parent().addClass('active');
        GLOBAL.set('_RMSTATE', $(e.target).parent().attr('mH-state'));
      }
    },

    reList: function(e) {
      if (e) {
        //console.log('event is', e);
        e.preventDefault();  //@@@listenTo로 호출된 경우-Uncaught TypeError: Cannot read property 'preventDefault' of undefined
        e.stopPropagation();  //@@@listenTo로 호출된 경우-Uncaught TypeError: Cannot read property 'stopPropagation' of undefined
      }
      //console.log('list is refreshed');
      //_sync
      this.syncPatients();
    },

    //!!!setInterval
    runtime: function() {
      if (GLOBAL.get('_RUNTIME')) {
        //console.log('runtimer running');
        //list runtimer start
        this.reList();
        runtimer = setInterval(function() {GLOBAL.trigger('change:_LISTDATE'); }, GLOBAL.get('_CHKINTV'));

      } else {
        //console.log('runtimer stop');
        //list runtimer stop
        clearInterval(runtimer);
      }

    },

    onRuntime: function(e) {
      e.preventDefault();
      e.stopPropagation();
      GLOBAL.set('_RUNTIME', true);
      //this.reList();
      //console.log('Global interval', GLOBAL.get('_RUNTIME'), GLOBAL.get('_CHKINTV'));
      $(e.target).removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
      //alert('onRuntime');
    },

    offRuntime: function(e) {
      e.preventDefault();
      e.stopPropagation();
      GLOBAL.set('_RUNTIME', false);
      ////console.log('Global interval', GLOBAL.get('_CHKINTV'));
      //console.log('Global interval', GLOBAL.get('_RUNTIME'), GLOBAL.get('_CHKINTV'));
      $(e.target).removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
      //alert('offRuntime');
    },

    //!!!교정요
    fillStateNum: function() {
      this.$el.find('span').each(function(){
        var state = $(this).parent().attr('mH-state');
        ////console.log('span state', state);
        //var num = Patient.Patients.where({tstate:state}).length;
        //$(this).text(num);
        //!!!치료상태 문자열: Global 상수화!!!
        var stateNum = {'진료대기':0,'치료대기':0,'치료베드':0,'수납대기':0,'보험환자':0,'일반환자':0};
        for(var st in stateNum) {
          if (Patient.Patients.where({KSTATE:st})) {
            stateNum[st] = Patient.Patients.where({KSTATE:st}).length;
          }
          ////console.log('state', st);
        }

        switch(state) {
        case '대기':
          //var num = Patient.Patients.where({tstate:'진료대기'}).length;
          var num = stateNum['진료대기'];
          break;
        case '치료':
          //var num = Patient.Patients.where({tstate:'치료대기'}).length + Patient.Patients.where({tstate:'치료베드'}).length;
          //sort 치료베드
          var num = stateNum['치료대기'] +  stateNum['치료베드'];
          break;
        /*
        case '수납':
          //var num = Patient.Patients.where({tstate:'수납대기'}).length;
          var num = stateNum['수납대기'];
          break;
        */
        case '완료':
          //var num = Patient.Patients.where({tstate:'보험환자'}).length + Patient.Patients.where({tstate:'일반환자'}).length;
          var num = stateNum['수납대기'] + stateNum['보험환자'] +  stateNum['일반환자'];
          break;
        default:
          var num = 0;
          //var num = Patient.Patients.where({tstate:'수납대기'}).length;
          break;
        }

        $(this).text(num);

      });
    },

  /**
   * Ajax : Sync MSSQL -> MYSQL
   * @caution: setInterval
   * @param   json collection Patient.Patients.toJSON() or pluck(?)
   * @return
   */
    syncPatients: function() {
      this.syncPatientsMSMY();
      this.syncPatientsMYBB();
    },

  /**
   * Ajax : Sync MYSQL -> Backbone
   * @caution: setInterval
   * @param   json collection Patient.Patients.toJSON() or pluck(?)
   * @return
   */
    syncPatientsMYBB: function() {
      //console.log('_syncPatientsMYBB date:', GLOBAL.get('_LISTDATE'));
      $.ajax({
        dataType: 'json',
        async:false,
        url: GLOBAL.get('_BASEURL') + 'API/list/patients/' + GLOBAL.get('_LISTDATE'),
        success: function(res) {
           Patient.Patients.set(res);
        }
      });
    },

  /**
   * Ajax : Sync MSSQL -> MYSQL
   * @caution: setInterval
   * @param   json collection Patient.Patients.toJSON() or pluck(?)
   * @return
   */
    syncPatientsMSMY: function() {
      //console.log('_syncPatientsMSMY date:', GLOBAL.get('_LISTDATE'));
      $.ajax({
        dataType: 'json',
        async:false,
        url: GLOBAL.get('_BASEURL') + 'API/list/syncPatientsMSMY/' + GLOBAL.get('_LISTDATE'),
      });
    }

  });

//-----------------------------------------------------------------------------
// OBJECTS:PatientListThead
//-----------------------------------------------------------------------------
  var PatientListThead = Backbone.View.extend({
    //el: $('#listSection thead'),
    tagName: 'thead',

    initialize: function() {

    },

    render: function() {

      this.template = _.template(theadTpls[GLOBAL.get('_TPLTAG')]);
      //this.$el.remove();
      //$('#listSection table').empty();
      $('#listSection table thead').remove();
      this.$el.html(this.template());
      //////console.log('PatientListThead el', this.template(), this.$el);
      //$('#listSection').find('thead').append(new PatientListThead().render().el);
      $('#listSection table').prepend(this.$el);
      //console.log('PatientListThead rendering.... this.$el', this.$el.html());
    },

    events: {
      'click .js-sortList': 'sortList',
    },

    sortList: function(e) {
      //!!!@@@sort desc / asc toggle
      Patient.PatientsSubset.comparator = function(patient) {
        return patient.get($(e.target).attr('mH-state'));
      }

      // call the sort method
      Patient.PatientsSubset.sort();
    },

    triggerSort: function() {
      //console.log('trigger Sort');

      switch(GLOBAL.get('_RMSTATE')) {
        case '대기':
          //var num = Patient.Patients.where({tstate:'진료대기'}).length;
          var sortKey = 'JTIME';
          break;
        case '치료':
          //var num = Patient.Patients.where({tstate:'치료대기'}).length + Patient.Patients.where({tstate:'치료베드'}).length;
          //sort 치료베드
          var sortKey = 'BNUM';
          break;
        case '완료':
          //var num = Patient.Patients.where({tstate:'보험환자'}).length + Patient.Patients.where({tstate:'일반환자'}).length;
          var sortKey = 'BONBU';
          break;
        default:
          var num = 0;
          //var num = Patient.Patients.where({tstate:'수납대기'}).length;
          break;
      }

      Patient.PatientsSubset.comparator = function(patient) {
        return patient.get(sortKey);
      }

      // call the sort method
      Patient.PatientsSubset.sort();

    }
  });

//-----------------------------------------------------------------------------
// OBJECTS:PatientListItem
//-----------------------------------------------------------------------------
  var PatientListItem = Backbone.View.extend({
    tagName: 'tr',

    initialize: function() {
      ////console.log('ItemView initialize');
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.close);
      //this.listenTo(this.model, 'change:name', this.changeName);
      //this.listenTo(this.model, 'change:age', this.changeAge);
    },

    render: function() {
      //console.log('PatientListItem is rendered');
      //this.template = _.template(require('text!tpl/ListItem' + GLOBAL.get('_TPLTAG') + '.html'));
      /*
      this.template = _.template(itemTpls[GLOBAL.get('_TPLTAG')]);
      ////console.log('itemview tag', GLOBAL.get('_TPLTAG'));
      this.$el.html(this.template(this.model.toJSON()));
      if (this.model.get('KSTATE') == '치료베드') {
        //console.log('치료베드 환자');
        this.initTimer();
      }
      return this;
*/
//      this.$el.append($(_.template(itemTpls[GLOBAL.get('_TPLTAG')])(this.model.toJSON())));

      this.$el.html(_.template(itemTpls[GLOBAL.get('_TPLTAG')])(this.model.toJSON()));

      //console.log('listItem rendering!!!!', _.template(itemTpls[GLOBAL.get('_TPLTAG')])(this.model.toJSON()));
      //console.log('listItem rendering!!!! this.model.toJSON()', this.model.toJSON());

      if (this.model.get('KSTATE') == '치료베드') {
        //console.log('치료베드 환자');
        this.initTimer();
      }

      return this;
      //this.$el.append($);
    },

    events: {
      'click .js-takePhoto': 'takePhoto',
      'click .js-assignBed': 'assignBed',
      'click .js-roomOut': 'roomOut',  //치료실 전용
      'click .js-showDetail': 'showDetail',
      'click .js-showChart': 'showChart',
      'click .glyphicon-play': 'startTimer',  //치료실 전용
      'click .glyphicon-pause': 'pauseTimer',  //치료실 전용
      'change .timerItem': 'changeTxItem',   //치료실 전용@@@@@설정에서 mH-val 불러오기
      //'click .txTimer': 'setTimer', //치료실 전용
      'change .timerIntv': 'setTime', //치료실 전용
      //'click .mH-ibtn': 'iBtnClick',   //iconButton Click
    },

    close: function() {
      ////console.log('model destroyed');
      this.$el.unbind();
      this.$el.remove();
    },

    changeName: function() {
      ////console.log('change:name');
    },

    changeAge: function() {
      ////console.log('change:age');
    },

    showChart: function() {
      //console.log('showChart', this.model.get('CHARTID'), this.model.get('NAME'), this.model.get('LASTDATE'));
      GLOBAL.set({_CURPTID:this.model.get('CHARTID'),
            _REFDATE:this.model.get('LASTDATE'),
            _EDITDATE:GLOBAL.get('_LISTDATE')});
      //GLOBAL.trigger('change:_CURPTID');
      //console.log('globals', GLOBAL.toJSON());
    },

    takePhoto: function() {
      $modal = MH.modal({title:'사진 찍기', body:_.template(photoTpl)()});
      var items = JSON.parse(this.model.get('PIC'));

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

      ////modal event handler
      var self = this;
      var photoFile = '';

      $modal.find('#np-photo-file').on('change', function(){
        //console.log('phtofile changed', this.files[0]);
        var newFile = this.files[0];
        if ( !newFile.type.match(/image.*/i) ){
          alert('Insert an image!');
        } else {
          photoFile = newFile;
        }
        return false;
      });

      $modal.find('#modal-confirm').on('click', function(){
        if (photoFile) {
          // append photo into FormData object
          var formData = new FormData();
          //console.log('formData', formData);
          formData.append('file', photoFile);
          formData.append('memo', $('#np-photo-memo').val());
          formData.append('uid', GLOBAL.get('_USERID')); //로그인 사용자 아이디에서 불러옴 ###
          formData.append('path', GLOBAL.get('_PATH_IMG')); //설정에서 불러옴 ###
          ////console.log('formData', formData);
          //console.log('uid, path', GLOBAL.get('_USERID'), GLOBAL.get('_PATH_IMG'));
          //savePhoto list_models.js
          //haniMoon.request('list:savePatientPhoto', id, formData, self);
          var id = self.model.get('CHARTID');
          var newPic = self._savePatientPhoto({id:id, data:formData}, $modal);
          //self._savePatientPhoto({id:self.model.get('CHARTID'), data:formData});
          //$modal.find('[data-dismiss="modal"]').trigger('click');
          //console.log('oldPic, newPic', self.model.get('PIC'), newPic);
          newPic = '[' + newPic + ',' + self.model.get('PIC').substring(1);
          //self.model.set('PIC', newPic);
          self.model.save({CHARTID:id, PIC:newPic}, {patch: true});
          //console.log('oldPic, newPic', self.model.get('PIC'), newPic);
          //[{"CAP_PATH":"000000177410120800.JPG","CAP_WDATE":"101208","CAP_REMARK":" ","CAP_BIGO1":"N01"}]
        }
      });

    },

    //@@@@@@@@@@@@@@@@@@@
    _savePatientPhoto: function(options, $modal) {
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
        ////console.log(data.photoFile.name + ' uploaded successfully !' );
        //$view.modal("hide");
        //console.log('photo response', res);
        $modal.find('[data-dismiss="modal"]').trigger('click');
        rs = res;
      })
      .fail(function () {
        //console.log('Error! An error occurred while uploading ');
        //    + photoFile.name + ' !' );
        return false;
      });

      return rs;
    },

    showDetail: function() {
      $modal = MH.modal({title:'상세 정보', body:_.template(detailTpl)(this.model.toJSON())});
/*
      ////event handler
      $modal.find('.js-addPatient').on('click', function(e){
        //!!!접수된 환자인지 확인, 날짜 확인,
        var user = 'D01';  //!!!GLOBAL.get('_USERID')
        Patient.Patients.create({CHARTID:$(e.target).attr('id'), user:user}, {type: 'post', wait: true});
        $modal.find('[data-dismiss="modal"]').trigger('click');
      });
*/
    },

    assignBed: function() {

      var items = [];
      for(var i=1;i<16;i++) { //!!!16 -> GLOBAL.get('_BEDMAX')
        items.push(MH.addZero(i));
      }

      $modal = MH.modal({title:'베드 설정', body:_.template(bedTpl)({items:items})});

      //$('body .modal .modal-body').html(_.template(bedTpl)({items:items}));

      $modal.find('.NAME').text(this.model.get('NAME'));
      _.each(_.pluck(_.where(Patient.Patients.toJSON(), {KSTATE:'치료베드'}), 'BNUM'), function(bed){   //점유 베드, 비점유 베드 표시
        //$view.find('#bed_' + parseInt(bed)).prop('disabled', true).removeClass('btn-warning').addClass('btn-default');
        $modal.find('#bed_' + bed).prop('disabled', true).removeClass('btn-warning').addClass('btn-default');
      });

      ////event handler
      $modal.find('.js-saveBed').on('click', function(e){
        //console.log('saveBed');
        //console.log('assignBed', self.model.get('CHARTID'));
        self.model.save({CHARTID:self.model.get('CHARTID'), BNUM:$(e.target).text(), BTIME:""}, {patch:true, wait: true});

        $modal.find('[data-dismiss="modal"]').trigger('click');
      });

    },

    roomOut: function() {
      var self = this;

      $modal = MH.modal({title:'<i class="glyphicon glyphicon-alert"></i><span>퇴실</span>', body:'<span>퇴실하시겠습니까?</span>'});
      ////event handler
      $modal.find('#modal-confirm').on('click', function(e){
        self.model.save({CHARTID:self.model.get('CHARTID'), KSTATE:'수납대기'}, {patch:true, wait: true});
        //console.log('퇴실되었습니다.');
        $modal.find('[data-dismiss="modal"]').trigger('click');
      });

    },

    changeTxItem: function(e) {
      e.preventDefault();
      e.stopPropagation();
      //console.log('changeTxItem is changed', $(e.target).find(':selected').attr('mH-val'));
      this.$el.find('.timerIntv').val($(e.target).find(':selected').attr('mH-val')).trigger('change');
    },
/*
    //### setTimer : 타이머 시간 조정
    setTimer: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(e.target).siblings().find('.glyphicon-play').length > 0) {
        //console.log('timer is stoped!!!!!!!!!');
      //drop down-------------------------
      } else {
        //console.log('timer is running~~~~~~~~~~');
      }
    },
*/
    //### setTime : 타이머 시간 설정
    setTime: function(e) {
      //console.log('setTime', $(e.target).val());
      e.preventDefault();
      e.stopPropagation();
      var time = $(e.target).val() + ':00';
      this.$el.find('.txTimer').text(time);
    },

    startTimer: function(e) {
      e.preventDefault();
      e.stopPropagation();
      //console.log('startTimer', this.model.get('BNUM'));
      $(e.target).removeClass('glyphicon-play').addClass('glyphicon-pause');
      this.$el.find('.timerItem').prop('disabled', true);
      this.$el.find('.timerIntv').prop('disabled', true);

      //MHTimer.startTimer(this.model.get('BNUM') + 0, function(){}, function(){cbEndTimer(model);});
      if (this.model.get('KSTATE') == '치료베드') {
        //this.model.save({CHARTID:model.get('CHARTID'), TIMER:}, {patch:true, wait: true});
        var timer = this._saveTimer('ST');
        MHTimer.startTimer(this.model.get('BNUM'), function(){}, function(){});
        //console.log('this.model.toJSON()', this.model.toJSON());
        this.model.set('TIMER', timer);
        //"ST:1:1397543462"
      } else {
        alert('치료베드 환자가 아닙니다.');
      }

    },

    pauseTimer: function(e) {
      e.preventDefault();
      e.stopPropagation();
      //console.log('stopTimer', this.model.get('BNUM'));
      $(e.target).removeClass('glyphicon-pause').addClass('glyphicon-play');
      this.$el.find('.timerItem').prop('disabled', false);
      this.$el.find('.timerIntv').prop('disabled', false);

      if (this.model.get('KSTATE') == '치료베드') {
        //this.model.save({CHARTID:model.get('CHARTID'), TIMER:}, {patch:true, wait: true});
        var timer = this._saveTimer('PS');
        MHTimer.pauseTimer(this.model.get('BNUM'), function(){});
        //console.log('this.model.toJSON()', this.model.toJSON());
        this.model.set('TIMER', timer);
        //"ST:1:1397543462"
      } else {
        alert('치료베드 환자가 아닙니다.');
      }
    },

    initTimer: function() {
      if (!this.model.get('TIMER')) {
         //console.log('타이머가 설정되어 있지 않습니다.', this.model.get('TIMER')) ;
      } else {
        //console.log('타이머를 재설정합니다.', this.model.get('TIMER')) ;

        var strTimer;
        var bed = this.model.get('BNUM');
        var arrTimer = this.model.get('TIMER').split(':');

        switch(arrTimer[0]) { ////@@@@@@@@
        case 'ST':  //StarT
          strTimer = arrTimer[3];
           //console.log('arrTimer---------------', arrTimer);
          //console.log('arrTimer[2]---------------', strTimer);

          //var interval = haniMoon.request('list:getInterval', arrTimer[2]);
          var interval;
          $.ajax({
            //type: 'POST',
            type:'GET',
            dataType: 'json',
            async:false,
            url: GLOBAL.get('_BASEURL') + 'API/list/getInterval/' + arrTimer[3],
            success: function(res) {
              ////console.log('_saveTimer ajax respose', res);
               interval = res;
            }
          });

          //ED시킴
          if (interval < 1) {
            //strTimer = MHTimer.getStrTimer(interval);
            ////console.log('strTimer', strTimer);
            this.$el.find('.txTimer').text('00:00');
            this.$el.find('.timerItem').val(arrTimer[1]);
            //this.$el.find('.timerIntv').val(arrTimer[2]);
            this.$el.find('.timerIntv').val('00');
            this.$el.find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
            this.$el.find('.timerItem').prop('disabled', false);
            this.$el.find('.timerIntv').prop('disabled', false);
            this._saveTimer('ED');
            //return false;
          } else {
            strTimer = MHTimer.getStrTimer(interval);
            //console.log('strTimer', strTimer);
            this.$el.find('.txTimer').text(strTimer);
            this.$el.find('.timerItem').val(arrTimer[1]);
            this.$el.find('.timerIntv').val(arrTimer[2]);

            this.$el.find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
            this.$el.find('.timerItem').prop('disabled', true);
            this.$el.find('.timerIntv').prop('disabled', true);
            //console.log("this.$el.find('.txTimer')", this.$el.find('.txTimer'));
            //timer는 돌아가되, 종료시간은 바꾸지 않도록!!!!!!!!!!!!@@@####
            //////////////////MHTimer.goOnTimer(bed);
            //MHTimer.startTimer(bed, function(){}, function(){cbEndTimer(model);});
            MHTimer.startTimer(bed, function(){}, function(){});
          }
          break;
        case 'PS':  //PauSe
          ////console.log('PS, arrTimer[2]', model.get('NAME'), arrTimer[2]);
          strTimer = MHTimer.getStrTimer(parseInt(arrTimer[3]));
          this.$el.find('.txTimer').text(strTimer);
          this.$el.find('.timerItem').val(arrTimer[1]);
          this.$el.find('.timerIntv').val(arrTimer[2]);
          ////console.log("this.$el.find('.txTimer')", this.$el.find('.txTimer').text());
          break;
        case 'ED':  //EnD
          //console.log('timer is End');
          this.$el.find('.timerItem').val(arrTimer[1]);
          this.$el.find('.timerIntv').val('00');
          //var time = this.$el.find('.timerIntv').val() + ':00';
          this.$el.find('.txTimer').text('00:00');
          //strTimer = MHTimer.getStrTimer(parseInt(arrTimer[3]));
          ////console.log("this.$el.find('.txTimer')", this.$el.find('.txTimer').text());
          break;
        }

      }
    },

    _saveTimer: function(type) {
      var interval = MHTimer.getSec(this.model.get('BNUM')) || 600;
      var timerItem = this.$el.find('.timerItem').val() || 1;
      var timerIntv = this.$el.find('.timerIntv').val() || 10;

      //server Update
      var options = {type: type, interval: interval, timerItem: timerItem, timerIntv: timerIntv};
      var rs;
      $.ajax({
        type: 'POST',
        //type:'GET',
        dataType: 'json',
        data: options,
        async:false,
        url: GLOBAL.get('_BASEURL') + 'API/list/saveTimer/' + GLOBAL.get('_LISTDATE') + '/' + this.model.get('CHARTID'),
        success: function(res) {
          //console.log('_saveTimer ajax respose', res);
          rs = res.TIMER;
           //Patient.Patients.set(res);
        }
      });
      //client Update
      //console.log('response', rs);
      return rs;
    },

  });

//-----------------------------------------------------------------------------
// OBJECTS:PatientList
//-----------------------------------------------------------------------------
  var PatientList = Backbone.View.extend({
    /*
    el: function() {
      return $('#' + UiId).find('tbody');
    },
    */
    tagName: 'tbody',

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'remove', this.removeOne);
      //!!!@@@simple rendering(DOM sort)
      this.listenTo(this.collection, 'sort', this.render);
      //this.listenTo(GLOBAL, 'change:_TXSTATE', this.changeState);
      this.listenTo(GLOBAL, 'change:_RMSTATE', this.changeState);
      //this.listenTo(GLOBAL, 'change:_RUNTIME', this.runtime);
    },

    preRender: function() {
      $panel = MH.panel(panelOpts);
      $panel.find('.panel-heading').empty().append(new PatientListHeader().render());
      $panel.find('.panel-body').empty().append($(_.template(bodyTpl)()));
    },

    render: function() {
      //new PatientListHeader().render();  //listHeader render
      new PatientListThead().render();  //listThead render
      this.$el.empty();
      this.collection.forEach(this.addOne, this);
      $panel.find('table').append(this.$el);
      //$('#listSection table').append(this.$el);
    },

    addOne: function(patient) {
      //this.options.state = 'WW';
      ////console.log('render addOne', patient.toJSON());
      this.$el.append(new PatientListItem({model:patient}).render().el);
      //this.$el.append(new PatientListItem({model:patient}).render());

      ////console.log('ChartIx addOne called');
      //this.$el.append(new PatientListItem({model:patient}).render().el);
      //new ChartIxItem({model:item}).render();
    },

    removeOne: function(patient) {
      ////console.log('collection removed', patient.get('id'));
      patient.trigger('destroy');
    },
/*
    renderHeader: function() {
      new PatientListHeader().render();  //listHeader render
    },
*/
    changeState: function(e) {
      //e.preventDefault();
      //this.collection.trigger('reset'); //!!!render 2번 호출됨
      Patient.Patients.trigger('reset'); //!!!render 1번 호출됨
      //console.log('this is PatientList... Listen change:_RMSTATE');
      if (GLOBAL.get('_RMSTATE') == '치료') {
        //console.log('치료실입니다. 타이머를 돌리세요...');
      } else {
        //console.log('치료실이 아닙니다. 타이머를 멈추세요...');
        MHTimer.stopAll();
      }
      //change sortKey
      //trigger sort
    },

  });

//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  return new PatientList({collection:Patient.PatientsSubset});

});