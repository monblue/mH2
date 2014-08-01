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
  var path = './html/';
  //var $modal;
  //var $iBtn   = $('.mH-ibtn');

////===========================================================================
//// private methods
////===========================================================================

////===========================================================================
//// OBJECTS
////===========================================================================
  var ShellView = Backbone.View.extend({
  	//el:'body',

    initialize: function () {
    	console.log('ShellView is initialized!!!');
    },

    render: function () {
      this.$el.html(template());

      console.log('html', this.$el.find('.js-viewThis').html());

      return this;
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

      //$(e.target).parent().parent().find('a').removeClass('active');
      this.$el.find('li a').removeClass('active');
      $(e.target).addClass('active');

      var file = path + $(e.target).attr('mH-anc');
      if ($(e.target).attr('mH-anc').search(/\/\//) > 0) {
        file = $(e.target).attr('mH-anc');
      }

    	console.log($(e.target).attr('mH-anc'));

    	$('.main-section').load(file, function() {
				//$(this).trigger('click');
			});

			$('.left-off-canvas-toggle').trigger('click');

    }


  });

//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  return new ShellView({el:'body'});
  //return new ShellView({});
});