//////************************************************************************
////// 이름:    router.js
////// 기능:    moonHani Chart Router Module
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
  //var _       = require('underscore');
  var Backbone  = require('backbone');
  var MH      = require('MH_utils');
  var GLOBAL    = require('share/Global');
//-----------------------------------------------------------------------------
// requires: models
//-----------------------------------------------------------------------------
  //var Patient   = require('chart/models/Patient');
//-----------------------------------------------------------------------------
// requires: views
//-----------------------------------------------------------------------------
  var ShellView   = require('share/Shell');
  //var TestView  = require('chart/views/Test');
  var LoginView   = require('share/Login');
  var ListView    = require('list/views/PatientList');
  var ChartDxView  = require('chart/views/ChartDx');
  var ChartRcView  = require('chart/views/ChartRc');
  var ChartIxView  = require('chart/views/ChartIx');
  var ChartTxView  = require('chart/views/ChartTx');
//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------

////===========================================================================
//// private properties
////===========================================================================

////===========================================================================
//// private methods
////===========================================================================
//-----------------------------------------------------------------------------
// DB setting
//-----------------------------------------------------------------------------
/**
 * Ajax : Create Table for Daily Patient List
 * @caution: !!!delete table: API/admin
 * @param   string $date
 * @return
 */
  //var _createPatientTable = function(date) {
  function _createPatientTable(date) {
    $.ajax({
      dataType: 'json',
      async: false,
      url: GLOBAL.get('_BASEURL') + 'API/list/createPatientTable/' + date,
      success: function() {
         ////console.log( 'Here I am',  ips[ip]);
         //return;  //!!!for loop가 종료되지 않음
      }
    });
  };

/**
 * Ajax : get ServerIP
 * @caution: NOT YET So Slow!!!
 * @param
 * @return
 */

/*
  function _getServerIp() {
    var ips = [
      '192.168.0.2','192.168.0.3','192.168.0.4','192.168.0.5','192.168.0.6',
      '192.168.0.7','192.168.0.8','192.168.0.9','192.168.0.10','192.168.0.11',
      '192.168.0.12','192.168.0.13','192.168.0.14','192.168.0.15','192.168.0.16'
    ];

    for (var ip in ips) {
      ////console.log('url is ', 'http://' + ips[ip] + '/mH/API/list/hereIs');

      $.ajax({
        dataType: 'json',
        async: false,
        url: 'http://' + ips[ip]+ '/mH/API/list/hereIam',
        success: function() {
           //console.log( 'Here I am',  ips[ip]);
           return;  //!!!for loop가 종료되지 않음
        }
      });

    }
  };
*/
////===========================================================================
//// OBJECTS
////===========================================================================
  return Backbone.Router.extend({
    //Routing
    routes:{
      '':'chart',
      //"L": "chart",
      "L:date": "chart",
      //"L:listDate/C:id(/R:refDate)": "chart",
      "L:listDate/C:id/R:refDate": "chart",
      //"L:date/S:state": "list",
    },

    initialize: function() {
//-----------------------------------------------------------------------------
// Check API Server(@@@Global.js에서 확인)
//-----------------------------------------------------------------------------
/*
  //_BASEURL로 통신 상태 확인
  //Yes
  //No -> Search & Restore _BASEURL or Error Message
*/

      //create today patient table([patient_YYYYmmdd], {patient_20140303})
      //실행하지 않아도 되는 경우는?
      var date = date || MH.getToday();
      GLOBAL.set('_LISTDATE', date);
      console.log('chart initialize ', date);
      //Backbone.history.navigate('L' + date);
      //_createPatientTable(GLOBAL.get('_LISTDATE'));
      //_createPatientTable(date);

      ////@@layout render
      ShellView.render();

      ListView.bodyView.preRender();
      ListView.bodyView.render();
      //GLOBAL.trigger('change:_LISTDATE');

      ///if (charing mode)
      ChartDxView.bodyView.preRender();
      ChartDxView.headView.$el.find('.glyphicon-folder-close').trigger('click');  //fold chartDx
      ChartRcView.bodyView.preRender();
      ChartIxView.bodyView.preRender();
      ChartTxView.bodyView.preRender();

      ////@@@ iconButton

      $('body .mH-ibtn').on('click', function(e) {  //작동이 되다 말다 함
        e.preventDefault();
        e.stopPropagation();
        console.log('iconButton clicked');
        $(e.target).children('i').trigger('click');
      });

      console.log('router initialized!!!');

    },

    login: function() {
      //$('#testArea').html(new TestView().render().el);
      ////console.log('testArea el: ', new TestView().render().el);
    },


    //refDate가 undefined인 경우는???@@@@@@@@@
    chart: function(date, id, refDate) {
      console.log('chart initialize ', date);
      GLOBAL.set('_LISTDATE', date);
      if (id) {
        console.log('_CURPTID is changed', GLOBAL.previousAttributes());
        GLOBAL.set({_CURPTID:id,
            _REFDATE:refDate,
            _EDITDATE:date});

      } else {  //@@@id가 없는 경우 Rc, IX, TX에서 직접 처리하도록 수정요
        //@@@@@header부분 empty
        ShellView.fillHeaderInfo('');
        GLOBAL.set({_CURPTID:''});
        //chart부분 empty
        //ChartRcView.bodyView.();
        //ChartIxView.bodyView.blankIxs();
        //ChartTxView.bodyView.preRender();
      }

      console.log('mH-ibtn reactivate');
      $('body .mH-ibtn').on('click', function(e) {  //작동이 되다 말다 함(remove 후에는 off되어버림@@@@@@)

        e.preventDefault();
        e.stopPropagation();
        console.log('iconButton clicked');
        $(e.target).children('i').trigger('click');
      });

      //setInverval!!!!!!!
      //var reload = setInterval(function() {GLOBAL.trigger('change:_LISTDATE'); }, 60000);

    },


  });

});