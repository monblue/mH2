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
      'click .js-showDx': 'showDx',
      'click .js-showSr': 'showSr',
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
    showDx: function(e) {
      //console.log('showDx....!!!!!!!!!!!');
      if (!$(e.target).hasClass('active')) {  //parent()안 넣는 방법은??
        $(e.target).parent().addClass('active').siblings().removeClass('active');
        $panel.find('#chartDx_Dx').removeClass('hide').siblings('div').addClass("hide");
      }
    },

    showSr: function(e) {
      //console.log('showSr....!!!!!!!!!!!');
      var strHtml = '<table class="table table-striped">' +
            '<thead><td>날짜</td><td>진료기록 요약</td><td>적용</td></thead>' +
            '<tbody>';
      $.ajax({
        //url: GLOBAL.get('_BASEURL') + 'API/chart/ChartOsscs/' + GLOBAL.get('_CURPTID'),
        url: GLOBAL.get('_BASEURL') + 'ChartOsscs/' + GLOBAL.get('_CURPTID'),
        async: false,
        dataType: 'json',
        success: function(res) {
          ////console.log('res!!!!!!!!', JSON.parse(res));
          //console.log('res!!!!!!!!', res);

          _.each(res, function(item){
            ////console.log('item.OSSC_DATE', item.OSSC_DATE, item.OSSC_PF);
            strHtml += '<tr><td>' + item.OSSC_DATE + '</td>' +
                   '<td class="OSSC_PF">' + item.OSSC_PF + '</td>' +
                   '<td><button class="btn btn-danger js-copyOssc" data-val="' + item.OSSC_DATE + '">적용</button></td></tr>';

          });

          strHtml = strHtml + '</tbody></table>';
          ////console.log('strHtml!!!!!!!!', strHtml);

          MH.modal({title:'이력:진료기록', body:strHtml});
        }
        //OSSC_DATE, CAST(OSSC_PF AS text) AS OSSC_PF
      });

      $modal = $('body .modal');

      $modal.find('.js-copyOssc').on('click', function(){
        ////console.log('bodyView.model.toJSON()', bodyView.model.toJSON());
        //bodyView.model.set({OSSC_PF:bodyView.$el.find(".OSSC_PF").text()});
        bodyView.model.set({OSSC_PF:$(this).parent().parent().find(".OSSC_PF").text()});
        bodyView.model.trigger('change');
        bodyView.render();
        //console.log('bodyView.model.toJSON()', bodyView.model.toJSON());
        ////console.log('js-copyOssc', $(this).attr('data-val'));
        //$('#chartSection').find('#OSSC_PF').val($(this).parent().parent().find(".OSSC_PF").text());
        //날짜 변경
        //GLOBAL.set('_REFDATE', $(this).attr('data-val');
      });
      ////console.log('strHtml', strHtml);

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