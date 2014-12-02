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
	var preDxTpl	= require('text!chart_tpl/ChartDx-preDx.html');
	var firstDxTpl	= require('text!chart_tpl/ChartDx-1stDx.html');
	var progressTpl	= require('text!chart_tpl/ChartDx-progress.html');
	var prognosisTpl	= require('text!chart_tpl/ChartDx-prognosis.html');
	//var bodyTpl	= require('text!chart_tpl/ChartTxBody.html');
  //var optionsTpl = require('text!chart_tpl/ChartTx-Item-options.html');
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
      //'click .js-showDx': 'showDx',
      'click .js-showPreDx': 'showPreDx',
      'click .js-show1stDx': 'show1stDx',
      'click .js-showProgress': 'showProgress',
      'click .js-showPrognosis': 'showPrognosis',
      'click .js-save': 'save',
      'click .glyphicon-folder-close': 'fold',
      'click .glyphicon-folder-open': 'unfold',
      'click .js-load': 'load',
      //'click .js-reList': 'reList',
    },
/*
    showDx: function(e) {
      //console.log('showDx....!!!!!!!!!!!');
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        $panel.find('#chartDR_Dx').removeClass('hide').siblings('div').addClass("hide");
      }
    },
*/
    showPreDx: function(e) {
      console.log('showPreDx....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');

				$tpl = $(_.template(preDxTpl)({}));	//@@@@@@@@@@@@ data에 따른 변경 가능하도록!!!
        $('#chartDx_Dx').html($tpl);

      }
    },

    show1stDx: function(e) {
      console.log('show1stDx....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        //$panel.find('#chartDx_Dx').removeClass('hide').siblings('div').addClass("hide");
				$tpl = $(_.template(firstDxTpl)({}));	//@@@@@@@@@@@@ data에 따른 변경 가능하도록!!!
        $('#chartDx_Dx').html($tpl);
      }
    },

    showProgress: function(e) {
      console.log('showProgress....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');

				$tpl = $(_.template(progressTpl)({}));	//@@@@@@@@@@@@ data에 따른 변경 가능하도록!!!
        $('#chartDx_Dx').html($tpl);

      }

    },


    showPrognosis: function(e) {
      console.log('showPrognosis....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');

				$tpl = $(_.template(prognosisTpl)({}));	//@@@@@@@@@@@@ data에 따른 변경 가능하도록!!!
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
    },

    changeId: function() {
      ////console.log('chartDx rendering......');
      this.model = new ChartDx();
      //this.model.fetch({async:false});

      //this.patient = Patient.Patients.get(GLOBAL.get('_CURPTID'));  //@@@@@@@patient 변수로 지정

      this.render();
      headView.reRender();
      //$panel.find('.panel-heading').empty().append(headView.render());

      //console.log('this.patient', this.patient.toJSON());
      //this.$el.find('#newJin').val(''); //신상기록 추가 textarea 비우기
      //this.$el.find('.js-delStamp').trigger('click'); //진료기록 날짜 제거@@@
      //this.$el.find('.js-delArea').trigger('click'); //특이사항 비우기@@@
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
      'click #js-showOssc': 'showOssc',
      'click #js-showJinmemo': 'showJinmemo',
      'click #js-showRemark': 'showRemark',
      'click .js-addStamp': 'addStamp',
      'click .js-delStamp': 'delStamp',
      'click .js-delArea': 'delArea',
      'click .js-saveAudio': 'saveAudio',
    },

    showOssc: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        $(this.el).find('#Ossc').removeClass('hide').siblings('span').addClass("hide");
      }
    },

    showJinmemo: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        $(this.el).find('#Jinmemo').removeClass('hide').siblings('span').addClass("hide");
      }
    },

    showRemark: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        $(this.el).find('#Remark').removeClass('hide').siblings('span').addClass("hide");
      }
    },

    addStamp: function(e) {
      console.log('addStamp@@@');
      e.preventDefault();
      e.stopPropagation();
      var $area = $(e.target).parent().next('textarea');
      var content = hM_trim($area.val());
      $area.val(hM_addDxStamp(content, {}));
      /*
      if(content) {
        //console.log('내용이 있어요...');
        $(this.el).find('#newJin').hM_selectRange($(this.el).find('#newJin').val().length);
      } else {
        //$(this.el).find('#newJin').val(hM_makeDxStamp() + '\n');
        //$(this.el).find('#newJin').hM_selectRange(hM_makeDxStamp().length + 2);
        $(this.el).find('#newJin').val(hM_makeDxStamp() + '\n');
        $(this.el).find('#newJin').hM_selectRange(hM_makeDxStamp().length + 2);
      }
      */
    },

    delStamp: function(e) {
      console.log('delStamp@@@');
      e.preventDefault();
      e.stopPropagation();
      var $area = $(e.target).parent().next('textarea');
      var content = hM_trim($area.val());
      $area.val(hM_delDxStamp(content, {}));
    },

    delArea: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $area = $(e.target).parent().next('textarea');
      $area.val('');
    },

    saveAudio: function(e) { //녹음 파일 저장
      console.log('saveAudio....!!!!!!!!!!!');
      e.preventDefault();
      e.stopPropagation();

  		var apiUrl = 'http://192.168.0.11:3333/saveAudio/';
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

/*
var fd = new FormData(document.getElementById("fileinfo"));
fd.append("CustomField", "This is some extra data");
$.ajax({
  url: "stash.php",
  type: "POST",
  data: fd,
  processData: false,  // tell jQuery not to process the data
  contentType: false   // tell jQuery not to set contentType
});


    var _takeaudioHandler = function($ui, self) {
      var audioFile = '';

      $ui.find('#np-audio-file').on('change', function(){
        audioFile = newFile;
        return false;
      });

      $ui.find('#modal-confirm').on('click', function(){
        if (audioFile) {
          // append audio into FormData object
          var formData = new FormData();

          formData.append('file', audioFile);
          formData.append('memo', $('#np-audio-memo').val());
          formData.append('uid', GLOBAL.get('_USERID')); //로그인 사용자 아이디에서 불러옴 ###
          formData.append('path', GLOBAL.get('_PATH_IMG')); //설정에서 불러옴 ###

          var id = self.model.get('CHARTID');
          //var newPic = _savePatientPhoto({id:id, data:formData}, $ui);
          //var oldPic = self.model.get('PIC');

          //oldPic.push(newPic);	//사진정보 추가

          //self.model.save({CHARTID:id, PIC:oldPic}, {patch: true});
        }
      });
    };
*/
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