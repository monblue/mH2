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
  var GLOBAL      = require('share/Global');
  var MH          = require('MH_utils');
//-----------------------------------------------------------------------------
// requires: models
//-----------------------------------------------------------------------------
  var Patient     = require('list/models/Patient');
//-----------------------------------------------------------------------------
// requires: views
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// requires: templates
//-----------------------------------------------------------------------------
  var tpl         = require('text!share_tpl/shell.html');
  var srhTpl      = require('text!share_tpl/shell-searchPatient.html');

////===========================================================================
//// private properties
////===========================================================================
  var template = _.template(tpl);
  var $menuItems;
  var $modal;
  //var $iBtn   = $('.mH-ibtn');

////===========================================================================
//// private methods
////===========================================================================

////===========================================================================
//// OBJECTS
////===========================================================================
  var ShellView = Backbone.View.extend({

    initialize: function () {
      //this.employeeList = new models.EmployeeCollection();
      this.listenTo(GLOBAL, 'change:_CURPTID', this.changeChart);
    },

    render: function () {
      this.$el.html(template());
      $menuItems = $('.navbar .nav li', this.el);
      return this;
    },

    events: {
      'keypress #np-srhPatient': 'searchPatientKey',
      'click #js-srhPatient': 'searchPatient',
      'click .js-saveAll': 'saveAll',
    },

    selectMenuItem: function (menuItem) {
      $menuItems.removeClass('active');
      if (menuItem) {
        $('.' + menuItem).addClass('active');
      }
    },

    //searchPatient: 환자 검색
    searchPatientKey: function(e) {
      e.stopPropagation();
      //e.preventDefault();
      if (e.keyCode === 13) {
        e.preventDefault();
        //this.$el.find('#js-srhPatient').trigger('click');
        this.$el.find('[type="submit"]').trigger('click');
      }
    },

    //searchPatient: 환자 검색
    searchPatient: function(e) {
      e.stopPropagation();
      e.preventDefault();
      //console.log('keypress searchPatient');
      var keyword = this.$el.find('#np-srhPatient').val();
      var jsonKeyword = this._getSearchWords(keyword);
      console.log('jsonKeyword', jsonKeyword);
      var self = this;
      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/list/searchPatient',
        type: 'post',
        async: false,
        data: jsonKeyword,
        dataType: 'json',
        success: function(res) {
          self._showSrhPatient(res);
          //console.log('response ', res);
        }
      });

    },

    saveAll: function() {
      console.log('saveAll clicked in Shell.js');
      GLOBAL.set('_SAVEDRC', -1);
    },

    changeChart: function() {
      //var id = GLOBAL.get('_CURPTID');
      //this.$el.find('#curPT').html(GLOBAL.get('_CURPTID'));
      //console.log('this PT', Patient.Patients.get(id).toJSON());
      /*
      var info = '';
      if (Patient.Patients.get(GLOBAL.get('_CURPTID')) {
        var pt = Patient.Patients.get(GLOBAL.get('_CURPTID'));
        var patient = {
                        "NAME":pt.get('NAME'),
                        "AGE":pt.get('AGE'),
                        "SEX":pt.get('SEX'),
                        "LAST":pt.get('LAST'),
                        "LAST2":pt.get('LAST2'),
                        "JEJUCODE":pt.get('JEJUCODE'),
                        "ITYPE":pt.get('ITYPE')
                      };
        info = MH.patientBrief(patient);
      }
      */

      var pt = Patient.Patients.get(GLOBAL.get('_CURPTID'));
      var patient = {
                      "NAME":pt.get('NAME'),
                      "AGE":pt.get('AGE'),
                      "SEX":pt.get('SEX'),
                      "LAST":pt.get('LAST'),
                      "LAST2":pt.get('LAST2'),
                      "JEJUCODE":pt.get('JEJUCODE'),
                      "ITYPE":pt.get('ITYPE')
                    };

      //this.$el.find('#curPT').html(MH.patientBrief(patient));
      this.fillHeaderInfo(MH.patientBrief(patient));
      //this.fillHeaderInfo(info);

    },

    fillHeaderInfo: function(data) {
      this.$el.find('#curPT').html(data);
    },

    _getSearchWords: function(keyword) {
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

      return {name: name, tel: tel, jumin: jumin};
    },

    _showSrhPatient: function(patients) {
      $modal = MH.modal({title:'환자 검색 결과', body:_.template(srhTpl)({items:patients})});
      ////event handler
      $modal.find('.js-addPatient').on('click', function(e){
        //!!!접수된 환자인지 확인, 날짜 확인,
        var user = 'D01';  //!!!GLOBAL.get('_USERID')
        Patient.Patients.create({CHARTID:$(e.target).attr('id'), user:user}, {type: 'post', wait: true});
        $modal.find('[data-dismiss="modal"]').trigger('click');
      });
    }

  });

//-----------------------------------------------------------------------------
// INSTANCE & RETURN
//-----------------------------------------------------------------------------
  return new ShellView({el:'body'});
});