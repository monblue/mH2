//////************************************************************************
////// 이름:    ChartDx.js
////// 기능:    moonHani Chart.ChartDx Module
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
  var GLOBAL    = require('share/Global');
  //var Chart      = require('app/models/Chart');
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
  var headerTpl  = require('text!chart_tpl/ChartDxHeader.html');
  var bodyTpl  = require('text!chart_tpl/ChartDxBody.html');

	var subTpl = {
		'preDx': require('text!chart_tpl/ChartDx-preDx.html'),
		'mainDx': require('text!chart_tpl/ChartDx-mainDx.html'),
		'progress': require('text!chart_tpl/ChartDx-progress.html'),
		'prognosis': require('text!chart_tpl/ChartDx-prognosis.html'),
		'decision': require('text!chart_tpl/ChartDx-decision.html')
	}

////===========================================================================
//// private properties
////===========================================================================
  var $chart    = $('#chartSection');
  var UiId    = 'chartDx';
  var panelOpts = {
      id: UiId,
      class: 'panel-success',
      append: '#chartSection'
    };

  var $panel = '';
////===========================================================================
//// private methods
////===========================================================================
//-----------------------------------------------------------------------------
// private methods:Header
//-----------------------------------------------------------------------------
/**
 *
 * @caution:
 */

////===========================================================================
//// OBJECTS
////===========================================================================
//-----------------------------------------------------------------------------
// OBJECTS:ChartDx
//-----------------------------------------------------------------------------

  var ChartDx = Backbone.Model.extend({
      idAttribute: 'CHARTID',
/*
      urlRoot: function() {
        return GLOBAL.get('_BASEURL') + 'API/chart/ChartDx/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE')+ '/' + GLOBAL.get('_CURPTID');
      },
*/
    });

//-----------------------------------------------------------------------------
// OBJECTS:ChartDxHeader
//-----------------------------------------------------------------------------
  var ChartDxHeader = Backbone.View.extend({
    /*
    el: function() {
      //return $('#chartIx').find('#Ix_' + this.model.get('seq'));
      return $panel;
    },
    */

    initialize: function() {
      this.listenTo(GLOBAL, 'change:_SAVEDDX', this.saveAll);
    },

    render: function() {
      this.$el.empty();
      //this.$el.off();
      this.$el.append($(_.template(headerTpl)()));
      return this.$el;
    },

    reRender: function() {
      if (bodyView.patient) {
        var patient = bodyView.patient;
        console.log('_CURPTID, patient is ', GLOBAL.get('_CURPTID'), patient.toJSON());
        if (patient.get('SAVEDDX') == 0) {
          this.activeHeader();
          console.log('activeHeader SAVEDDX', patient.get('SAVEDDX'));
        } else {
          this.passiveHeader();
          console.log('passiveHeader SAVEDDX', patient.get('SAVEDDX'));
        }
      }
    },

    events: {
      'click .js-showSub': 'showSub',
      'click .js-save': 'save',
      'click .glyphicon-folder-close': 'fold',
      'click .glyphicon-folder-open': 'unfold',
      'click .js-load': 'load',
    },

    showSub: function(e) {	//저장할 것인지 물어보도록 해야!!!@@@@
      console.log('showDecision....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
				$tpl = $(_.template(subTpl[$(e.target).attr('data-value')])({}));	//@@@@@@@@@@@@ data에 따른 변경 가능하도록!!!
        $('#chartDx_Dx').html($tpl);

      }
    },

    save: function(e) { //@@@진료기록/신상기록/특이사항 나누어서 저장

    },

    saveAll: function(e) {

    },

    activeHeader: function() {
      this.$el.parent().parent().removeClass('passive');
      //this.$el.find('.glyphicon-folder-open').trigger('click');
    },

    passiveHeader: function() {
      this.$el.parent().parent().addClass('passive');
      //this.$el.find('.glyphicon-folder-close').trigger('click');
    },

    fold: function(e) {
      e.preventDefault();
      e.stopPropagation();
      $panel.find('.panel-body').addClass('hide');
      $(e.target).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
    },

    unfold: function(e) {
      e.preventDefault();
      e.stopPropagation();
      $panel.find('.panel-body').removeClass('hide');
      $(e.target).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
    },


    load: function(e) {
      //console.log('load....!!!!!!!!!!!', bodyView.model.toJSON());

    },


  });

//-----------------------------------------------------------------------------
// OBJECTS:ChartDxBody
//-----------------------------------------------------------------------------
  var ChartDxBody = Backbone.View.extend({

    initialize: function() {
      this.listenTo(GLOBAL, 'change:_CURPTID', this.changeId);
      //this.listenTo(this.model, 'destroy', this.close);
      this.listenTo(this.model, 'change', this.render);
    },

    preRender: function() {
      //var dataDx = {OSSC_PF:'', JINMEMO_MEMO:'', REMK_REMARK:''};
      this.$el.empty();
      //this.$el.off();
      this.$el.append($(_.template(bodyTpl)()));
      $panel = MH.panel(panelOpts);
      //$panel.find('.panel-heading').empty().append(new ChartDxHeader().render());
      $panel.find('.panel-heading').empty().append(headView.render());
      $panel.find('.panel-body').empty().append(this.$el);

      this.$el.on();	//테스트중
    },

    changeId: function() {
      this.model = new ChartDx();
      this.render();
      headView.reRender();
    },

    render: function() {
      /*
      var data = this.model.toJSON();
      for (var key in data) {
        this.$el.find('#' + key).val(data[key]);
      }
      this.$el.find('#newJin').val(''); //신상기록 추가 textarea 비우기
      this.$el.find('.js-delStamp').trigger('click'); //진료기록 날짜 제거@@@
      this.$el.find('.js-delArea').trigger('click'); //특이사항 비우기@@@
      */
    },

    events: {
      'click .js-saveDxPre': 'saveDxPre',
      'click .js-fillDxPre': 'fillDxPre',
      'click .js-loadDxPre': 'loadDxPre',
      'click .js-saveAudio': 'saveAudio',
      'click .js-showMainDx': 'showMainDx',

    },


    saveAudio: function(e) { //녹음 파일 저장
      console.log('saveAudio....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

  		var apiUrl = GLOBAL.get('_BASEURL') + 'saveAudio/';
  		var id = GLOBAL.get('_CURPTID');

			//var fd = new FormData(document.getElementById("audio-file"));
			//console.log('formdata', fd);
			//fd.append("CustomField", "This is some extra data");

			var formData = new FormData();
			//formData.append('file', $('input[type=file]')[0].files[0]);
			//formData.append('file', $(e.target).parent().find('#np-audio-file')[0].files[0]);
			//var audiofile = $('#np-audio-file')[0].files[0] || $('#np-audio-file').files[0];
			formData.append('file', $('#np-audio-file')[0].files[0]);	//@@@@@@@@@@@@@ [0] 로 인해서 에러가 날 수 있음!!!!!!!!!!
			//alert(audiofile.name);
			//console.log(audiofile);

			$.ajax({
        url: apiUrl + id,
        type: 'POST',
			  data: formData,
        async: false,
        cache: false,
			  processData: false,  // tell jQuery not to process the data
			  contentType: false   // tell jQuery not to set contentType
			});

/*
      $.ajax({
        url: apiUrl + id,
        async: false,
        type: 'POST',
        data: {},
        //dataType: 'json',
        success: function(res) {
          console.log('saveAudio done!!!', res);
          //rs = res;
        }
      });
*/
    },

    saveDxPre: function(e) { //예진 저장
      console.log('saveDxPre....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

  		var apiUrl = GLOBAL.get('_BASEURL') + 'diagnosis/';
  		var id = GLOBAL.get('_CURPTID');
  		var date = GLOBAL.get('_EDITDATE');

  		console.log('id, date', id, date);

			var data = MH.serializeObject(this.$el.find('#frmPreDx'));
			//console.log('serialized Data!!!! ', data.serializeArray());
			console.log('data!!!! ', data, Object.keys(data).length);

			if (!id || !date || !Object.keys(data).length) {
				alert('id, date가 없어요!!!');	//@@@@@@@
				return false;	//id, date가 없으면 오류 발생
			}

			data.date = date;
			data.chartId = id;
			data.kind = '예진';

			//@@@@1일 1회 초과 저장 가능하게 할 것인지?
			//동일 날짜에 저장 data가 있는 경우는 update할 것인지...
			//저장되면 저장 button을 inActivate 할 것인지?

			$.ajax({
        url: apiUrl + id + '/' + date,
        type: 'POST',
        dataType: 'json',
			  data: data,
        async: false,
        cache: false,
			});

    },

    fillDxPre: function(e) { //예진 폼 채우기
      console.log('saveDxPre....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

			var frm = this.$el.find('#frmPreDx');
    	//var data = {"Fname":"문","Lname":"정삼", "gender":"Male", "food":["Steak","Pizza"],"quote":"테스트 중입니다.","education":"HighSchool","TofD":["Morning","Day","Night"],"Sb1":"1"};
     	var data = {"주소증" : "허리 통증", "체중" : "56", "신장" : "156", "혈압수축" : "120", "혈압이완" : "80" };
     	//var data = { "cc" : "요각통", "wt" : "35", "ht" : "120", "bp1" : "110", "bp2" : "78" };
    	MH.fillForm({obj:frm, data:data});
    },

    loadDxPre: function(e) { //예진 폼 채우기
      console.log('loadDxPre....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

  		var apiUrl = GLOBAL.get('_BASEURL') + 'diagnosis/';
  		var id = GLOBAL.get('_CURPTID');
  		var date = GLOBAL.get('_EDITDATE');

  		var self = this;
			$.ajax({
        url: apiUrl + id + '/' + date,
        type: 'GET',
      	dataType: 'json',
      	async: false
			})
			.done(function (res) {
				console.log('read data', res);
				var frm = self.$el.find('#frmPreDx');
      	MH.fillForm({obj:frm, data:res});
    	});

    },

		showMainDx: function(e) { //show 망진
      //console.log('showMainDx1....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();
      $(e.target).parent().addClass('active').siblings().removeClass('active');
      //console.log('show', $(e.target).attr('data-target'));
      this.$el.find($(e.target).attr('data-target')).removeClass('hide').siblings('div').addClass("hide");
		},

  });

//-----------------------------------------------------------------------------
// INSTANCES
//-----------------------------------------------------------------------------
  var headView = new ChartDxHeader();
  var bodyView = new ChartDxBody({model:new ChartDx()});

//-----------------------------------------------------------------------------
// RETURN
//-----------------------------------------------------------------------------
  return {
    headView: headView,
    bodyView: bodyView
  }

});