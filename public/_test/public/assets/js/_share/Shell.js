//////************************************************************************
////// 이름:    router.js
////// 기능:    moonHani Shell(index.html layout) Module
//////************************************************************************
define(function (require) {
  "use strict";
////===========================================================================
//// requires
////===========================================================================
//-----------------------------------------------------------------------------
// requires: libraries
//-----------------------------------------------------------------------------
  var $           = require('jquery');
  var _           = require('underscore');
  var Backbone    = require('backbone');

  //window.classie    = require('classie');
  //window.modernizr    = require('modernizr.custom');
  //window.mlPushmenu    = require('mlpushmenu');
  //var GLOBAL      = require('share/Global');
  //var MH          = require('MH_utils');
//-----------------------------------------------------------------------------
// requires: models
//-----------------------------------------------------------------------------
  //var Patient     = require('list/models/Patient');
//-----------------------------------------------------------------------------
// requires: views
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
  var tpl         = require('text!share_tpl/shell.html');
  //var srhTpl      = require('text!share_tpl/shell-searchPatient.html');

////===========================================================================
//// private properties
////===========================================================================
  var template = _.template(tpl);
  var $menuItems;
  var path = '../public/html/';
  //var $modal;
  //var $iBtn   = $('.mH-ibtn');

////===========================================================================
//// private methods
////===========================================================================

////===========================================================================
//// OBJECTS
////===========================================================================
  var ShellView = Backbone.View.extend({
  	el:'body',

    initialize: function () {
    	console.log('ShellView is initialized!!!');
    	//this.el = $('.container');
    	//var pushMenu = new Mlpushmenu();
    	//Mlpushmenu.mlpushmenu( document.getElementById( 'mp-menu' ), document.getElementById( 'trigger' ) );
    	/*
    	window.classie    = require('classie');
  		window.modernizr    = require('modernizr.custom');
  		window.mlPushmenu    = require('mlpushmenu');

    	new mlPushMenu( document.getElementById( 'mp-menu' ), document.getElementById( 'trigger' ) );
    	*/
      //this.employeeList = new models.EmployeeCollection();
      //this.listenTo(GLOBAL, 'change:_CURPTID', this.changeChart);
      //require(['modernizr.custom', 'classie', 'mlpushmenu'], function(modernizr, classie, mlpushmenu) {
    		//mlpushmenu.mlpushmenu( document.getElementById( 'mp-menu' ), document.getElementById( 'trigger' ) );
			//});
    },

    render: function () {
      this.$el.html(template());

      console.log('html', this.$el.find('.js-viewThis').html());
      var self = this;


      //events에 event가 안먹힘@@@@@@@@@@@@@
      this.$el.find('.js-viewThis').on('click', function(e){
	      e.preventDefault();
	      e.stopPropagation();
	    	console.log('clicked viewThis2222');
	    	console.log($(e.target).attr('mH-anc'));
/*
	    	//load 방법
	    	1) jQuery: html, txt, .load
	    	2) backbone: view
*/
				var file = path + $(e.target).attr('mH-anc');
				self.$el.find('.content').load( file , function() {
				  //alert( "Load was performed." );
				  console.log($('#trigger').html());
				  //$('#trigger').trigger('click');
				  $(this).trigger('click');
				});
	    	//self.$el.find('.content').html($(e.target).attr('mH-anc'));
      });
      //this.$el.append($(template()));
      //$menuItems = $('.navbar .nav li', this.el);
      //return this;
      return this.$el;
    },

    events: {
      //'keypress #np-srhPatient': 'searchPatientKey',
      //'click #js-srhPatient': 'searchPatient',
      'click .js-test': 'test',
      'click .js-viewThis': 'viewThis',
    },

    selectMenuItem: function(menuItem) {
    	/*
      $menuItems.removeClass('active');
      if (menuItem) {
        $('.' + menuItem).addClass('active');
      }
      */
    },

    test: function(e) {
      e.preventDefault();
      e.stopPropagation();
    	console.log('clicked test');
    	//console.log($(this.el).attr('mH-anc'));
    },

    viewThis: function(e) {
      e.preventDefault();
      e.stopPropagation();
    	console.log('clicked viewThis');
    	console.log($(e.target).attr('mH-anc'));
    }


  });

//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  //return new ShellView({el:'body'});
  return new ShellView({});
});