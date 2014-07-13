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
  //var LoginView   = require('share/Login');
  var ListView  = require('list/views/PatientList');
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
  function _syncPatientsMSMG(date) {
    $.ajax({
      dataType: 'json',
      async: false,
      url: GLOBAL.get('_BASEURL') + 'syncPatientsMSMG/' + date,
      success: function() {
         console.log('sync MS(MSSQL) to MG(mongodb)');
         //return;  //!!!for loop가 종료되지 않음
      }
    });
  };

////===========================================================================
//// OBJECTS
////===========================================================================
  return Backbone.Router.extend({
    //Routing
    routes:{
      '':'list',
      //"L": "list",
      "L:date": "list",
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
      //_createPatientTable(GLOBAL.get('_LISTDATE'));

      _syncPatientsMSMG(GLOBAL.get('_LISTDATE'));

      ////@@layout render
      //ShellView.render();

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

    //list: function(date) {
    list: function() {
      ListView.bodyView.preRender();
      ListView.bodyView.render();
      GLOBAL.trigger('change:_LISTDATE');
    },

    chart: function(date, id) {

    },

  });

});