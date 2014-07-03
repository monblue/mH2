//////************************************************************************
////// 이름:    ChartIx.js
////// 기능:    moonHani Chart.ChartIx Module
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
  var headerTpl  = require('text!chart_tpl/ChartIxHeader.html');
  var bodyTpl  = require('text!chart_tpl/ChartIxBody.html');
  var searchTpl  = require('text!chart_tpl/ChartIx-searchIx.html');
  var prmIxsTpl  = require('text!chart_tpl/ChartIx-PrmIxs.html');

////===========================================================================
//// private properties
////===========================================================================
  var $chart    = $('#chartSection');
  var UiId    = 'chartIx';
  var panelOpts = {
      id: UiId,
      class: 'panel-success',
      append: '#chartSection'
    };


  var $panel = '';
////===========================================================================
//// private methods
////===========================================================================
/*
  //var _showPrmIxs = function() {
  var _showPrmIxs = function(title, self) {

      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/chart/getPrmIxs',
        type: 'get',
        async: false,
        //data: keyword,
        dataType: 'json',
        success: function(res) {
          return _showPrmIxsUI(title, res);
          //$modal = MH.modal({title:'약속상병', body:_.template(prmIxsTpl)({data:res})});
          //console.log('response ', res);
          //$modal.find('.modal-footer').remove();
        }
      });
  };
*/
  var _prmIxsData = function() {
    var rs;
    var title = '';
    var items = [];
      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/chart/getPrmIxs',
        type: 'get',
        async: false,
        //data: keyword,
        dataType: 'json',
        success: function(res) {
          /*
          var res = [
            {"Title":"title1", "NAME":"Name1", "DISM_ID":"id1", "DISM_KEY":"key1"},
            {"Title":"title1", "NAME":"Name2", "DISM_ID":"id2", "DISM_KEY":"key2"},
            {"Title":"title1", "NAME":"Name3", "DISM_ID":"id3", "DISM_KEY":"key3"},
            {"Title":"title2", "NAME":"Name4", "DISM_ID":"id4", "DISM_KEY":"key4"},
            {"Title":"title2", "NAME":"Name5", "DISM_ID":"id5", "DISM_KEY":"key5"},
            {"Title":"title2", "NAME":"Name6", "DISM_ID":"id6", "DISM_KEY":"key6"}
          ];
          */
          _.each(res, function(item) {
            if (item.Title != title) {
              title = item.Title;
              var ixItem = [{"NAME":item.NAME, "DISM_ID":item.DISM_ID, "DISM_KEY":item.DISM_KEY}];
              items.push({title:title, ixs:ixItem});
            } else {
              var ix = _.findWhere(items, {title:item.Title});
              var ixItem = {"NAME":item.NAME, "DISM_ID":item.DISM_ID, "DISM_KEY":item.DISM_KEY};
              ix.ixs.push(ixItem);
            }
          });

        }
      });
    //return rs;
    console.log('items', items);
    return items;
  };

  var _showPrmIxs = function(title, self) {
      console.log('_showPrmIxsUI');
      var data = _prmIxsData();
      $modal = MH.modal({title:title, body:_.template(prmIxsTpl)({data:data})});
      //console.log('response ', res);
      $modal.find('.modal-footer').remove();
      return $modal;
      //_prmIxsHandler($modal);
  };

  //var _prmIxsHandler = function($ui, self) {
  var _prmIxsHandler = function($ui, self) {
    $ui.find('.js-apply').on('click', function(e){
      e.stopPropagation();
      //console.log('prmIxs apply', $(e.target).parent().parent().find('.prmIxName').text());
      //console.log('bodyView.collection', bodyView.collection.toJSON());
      console.log('prmIxs apply items', $(e.target).parent().parent().find('.prmIxItems').html());
      _emptyIxs(bodyView.collection);
      $(e.target).parent().parent().find('.prmIxItems div').each(function(i){
        var ix = {ODSC_BIGO1:$(this).find('.prmIxKey').text(), ODSC_DISM_ID:$(this).find('.prmIxId').text(), ixName:$(this).find('.prmIxName').text()}
        bodyView.collection.get(i + 1).set(ix);

      });

      //var items =
      //bodyView.collection.
      $ui.find('[data-dismiss="modal"]').trigger('click');
    });
  };

  var _emptyIx = function(Ix) {
    console.log('emptyIx!!!');
    Ix.set({ODSC_BIGO1:'', ODSC_DISM_ID:'', ixName:''});  //@@@empty model
  };

  var _emptyIxs = function(Ixs) {
    console.log('emptyIxs!!!');
    for(var i=1;i<4;i++) {
      _emptyIx(Ixs.get(i));
    }
  };
////===========================================================================
//// OBJECTS
////===========================================================================
//-----------------------------------------------------------------------------
// OBJECTS:ChartIx
//-----------------------------------------------------------------------------
  var ChartIx = Backbone.Model.extend({
      idAttribute: 'seq',
      defaults: {
        seq: null,
        ODSC_BIGO1:'',
        ODSC_DISM_ID:'',
        ixName:''
      },
      urlRoot: function() {
        ////console.log('url is!!!!!!!!!!!!!!!', GLOBAL.toJSON());
        //return GLOBAL.get('_BASEURL') + 'API/chart/ChartRc/' + GLOBAL.get('_CHARTID') + '/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE');
        return GLOBAL.get('_BASEURL') + 'API/chart/ChartIxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
        //return 'http://192.168.0.11/mH/API/chart/ChartRc/20130903/20140410';
      },
    });

//-----------------------------------------------------------------------------
// OBJECTS:ChartIxs
//-----------------------------------------------------------------------------
  var ChartIxs = Backbone.Collection.extend({
      model: ChartIx,
      url: function() {
        //console.log('url is!!!!!!!!!!!!!!!', GLOBAL.toJSON());
        //return GLOBAL.get('_BASEURL') + 'API/chart/ChartRc/' + GLOBAL.get('_CHARTID') + '/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE');
        return GLOBAL.get('_BASEURL') + 'API/chart/ChartIxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE') + '/' + GLOBAL.get('_CURPTID');
        //return 'http://192.168.0.11/mH/API/chart/ChartRc/20130903/20140410';
      },
    });

//-----------------------------------------------------------------------------
// OBJECTS:ChartIxHeader
//-----------------------------------------------------------------------------
  var ChartIxHeader = Backbone.View.extend({

    initialize: function() {
      //this.render();
      //this.listenTo(this.model, 'change:_LISTDATE', this.reList);
      //this.listenTo(ChartIx.ChartIxs, 'add', this.fillStateNum);
      this.listenTo(GLOBAL, 'change:_SAVEDIX', this.saveAll);
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
        if (patient.get('SAVEDIX') == 0) {
          this.activeHeader();
          console.log('activeHeader');
        } else {
          this.passiveHeader();
          console.log('passiveHeader');
        }
      }
    },

    events: {
      'click .js-showSr': 'showSr',
      'click .js-showHs': 'showHs',
      'click .js-save': 'save',
      'click .glyphicon-folder-close': 'fold',
      'click .glyphicon-folder-open': 'unfold',
      'click .js-load': 'load',
      'click .js-showPrmIxs': 'showPrmIxs'
      //'click .js-reList': 'reList',
    },

    showSr: function(e) {
      //console.log('showSr....!!!!!!!!!!!', bodyView.collection.toJSON());
    },

    showHs: function(e) {
      //console.log('showHs....!!!!!!!!!!!', bodyView.collection.toJSON());
    },

    save: function(e) {
      //console.log('save chartIxs....!!!!!!!!!!!');
      var items = [];

      var temps = bodyView.collection.toJSON();
      var seq = 1;
      _.each(temps, function(item){
        if (item.ODSC_DISM_ID) {
          item.seq = seq++;
          items.push(item);
        }
      });

      var data = {
        items: items,
        MEDM: GLOBAL.get('_MEDM'),  //
        GWAM: GLOBAL.get('_GWAM'), //진료과목?
        //FDOC: GLOBAL.get('_FDOC'),  //
        //LDOC: GLOBAL.get('_LDOC')  //
        //VCODE:
        //SANG:
      };

      $.ajax({
        url: GLOBAL.get('_BASEURL') + 'API/chart/ChartIxs/' + GLOBAL.get('_REFDATE') + '/' + GLOBAL.get('_EDITDATE')+ '/' + GLOBAL.get('_CURPTID'),
        type: 'POST',
        data: data,
        async: false,
        //dataType: 'json',
        success: function(res) {
          //
        }
      });

      //console.log('saved IX');
      ////@@@환자정보 갱신
      //var patient = Patient.Patients.get(GLOBAL.get('_CURPTID'));
      var patient = bodyView.patient;
      patient.save({'CHARTID':patient.get('CHARTID') , 'SAVEDIX':1}, {patch:true});
      GLOBAL.set('_SAVEDIX', 1);
      console.log('patient in IX', patient);
    },

    saveAll: function(e) {
      if (GLOBAL.get('_SAVEDIX') == 1) {
        this.passiveHeader();
        return;
      } else if (GLOBAL.get('_SAVEDIX') == 0) {
        return;
      }

      this.save();
      console.log('chartIx is saved now!!!');
      GLOBAL.set('_SAVEDTX', -1);
      //GLOBAL.set('_SAVEDIX', 1);
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
      //console.log('foldBody~~~~~~~~~~~~~~');
      $panel.find('.panel-body').addClass('hide');
      //console.log('span....', $(e.target));
      //$(e.target).removeClass('js-foldBody').addClass('js-unfoldBody');
      $(e.target).removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
      //$(e.target).children('span').hM_toggleIcon('glyphicon-folder-close', 'glyphicon-folder-open');
      //this.trigger('chart:searchTx');
    },

    unfold: function(e) {
      e.preventDefault();
      e.stopPropagation();
      $panel.find('.panel-body').removeClass('hide');
      $(e.target).removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
    },


    load: function(e) {
      //console.log('load....!!!!!!!!!!!', bodyView.collection.toJSON());
      //var chartIx = new ChartIxBody({});
      //Chart.Rc()
      //chartIx.render('0000001675');
    },

    showPrmIxs: function(e) {
      console.log('showPrmIxs!!!');

      //_prmIxsHandler();
      //$modal = _showTakePhoto('사진 찍기(' + this.model.get('NAME') + ')', this);
      $modal = _showPrmIxs('약속 상병', this);
      //console.log('showPrmIxs', $modal);
      _prmIxsHandler($modal, this);
    },


  });

//-----------------------------------------------------------------------------
// OBJECTS:ChartIxItem
//-----------------------------------------------------------------------------
  ChartIxItem = Backbone.View.extend({
    el: function() {
      //this.$el.off();
      var $thisEl = $('#chartIx').find('#Ix_' + this.model.get('seq'));
      $thisEl.off();  //@@@@@@@!!!! bubbling 없앰!!!!
      return $thisEl;
    },

    initialize: function(){ //model change => render
      //this.model.on('change', this.render, this);
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.close);
      //this.listenTo(this.model, 'clear', this.close);
    },

    render: function() {
      //this.$el.off();
      //this.$el = $('#chartIx').find('#Ix_' + this.model.get('seq'))
      var data = this.model.toJSON();
      for(var key in data) {
        this.$el.find('.' + key).val(data[key]);
      }

      console.log('ixitem rendering....');

      //@@@del되었던 값이 채워지면
      if (data.ixName) {
        this.$el.find('.glyphicon-share').removeClass('glyphicon-share').addClass('glyphicon-remove-sign');
      }
      //this.$el = $('body').find('#Ix_' + data.seq).end();
      ////console.log('this.$el', this.$el);
    },

    events: {
      //'focus .ixName': 'checkEmpty',
      //'click .ixName': 'checkEmpty',
      'keypress .ixName': 'searchIx',
      'click .search-Ixs': 'selectIx',
      //'click .js-shiftIx': 'shiftIx',
      //'click .js-delIx': 'delIx',
      'click .glyphicon-remove-sign': 'delIx',
      'click .glyphicon-share': 'undelIx',
    },

    close: function() {
      //console.log('model destroyed');
      this.$el.off();
      this.$el.remove();
      //this.$el.find('input').val('');
    },

    checkEmpty: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if($(e.target).val()) {
        //console.log('not Empty');
      } else {
        //console.log('Empty Go On');
      }
    },

    searchIx: function(e) {
      //e.preventDefault();
      e.stopPropagation();

      //if (e.keyCode == 13 && keyword) {
      if (e.keyCode == 13) {
        //e.preventDefault();
        e.stopPropagation();
        console.log('searchIx', $(e.target).val());
        //var keyword = $(e.target).val();
        var keyword = hM_trim($(e.target).val());
        if (!keyword) {
          return false;
        }

        var self = this;

        //console.log('searchIx by Enter', keyword);

        $.ajax({
          url: GLOBAL.get('_BASEURL') + 'API/chart/searchIx/' + keyword,
          async: false,
          dataType: 'json',
          success: function(res) {
            self.$el.find('.dropdown-menu').remove();
            self.$el.find('style').remove();
            self.$el.find('.dropdown').append($(_.template(searchTpl)({items:res})));
            self.$el.find('.dropdown-toggle').trigger( "click" );
          }
        });
      }

    },

    selectIx: function(e) {
      console.log('selectIx##########', this.model);
      //e.preventDefault();
      e.stopPropagation();
      //console.log('clicked selectIx', $(e.target).text());
      this.model.set({ixName:$(e.target).attr('mH-name'), ODSC_BIGO1:$(e.target).attr('mH-key'), ODSC_DISM_ID:$(e.target).attr('mH-code')});
      this.$el.find('.dropdown-menu').remove();
      this.$el.find('style').remove();
      ////console.log('model is', this.model);
    },

    delIx: function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('delIx clicked');
      this.model.set({ODSC_BIGO1:'', ODSC_DISM_ID:'', ixName:''});  //@@@empty model
      $(e.target).removeClass('btn-info').removeClass('glyphicon-remove-sign').addClass('btn-danger').addClass('glyphicon-share');
      //@@@비어있었던 attributes가 채워지면 icon을 다시 remove-sign으로 바뀌도록!!!
    },

    undelIx: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.model.set(this.model.previousAttributes());  //@@@recover attributes
      //console.log('this.model.previousAttributes()', this.model.previousAttributes());
      $(e.target).removeClass('btn-danger').removeClass('glyphicon-share').addClass('btn-info').addClass('glyphicon-remove-sign');
    }
  });

//-----------------------------------------------------------------------------
// OBJECTS:ChartIxBody
//-----------------------------------------------------------------------------
  var ChartIxBody = Backbone.View.extend({

    initialize: function() {
      //this.listenTo(this.model, 'change', this.render);
      this.listenTo(GLOBAL, 'change:_CURPTID', this.changeId);
      this.listenTo(this.collection, 'add', this.addOne);
      //this.listenTo(, 'destroy', this.close);
    },

    preRender: function() {
      //this.$el = $('<span>ChartIxBody!!!!!!!!!</span>');
      //console.log('ChartIxBody preRender');

      //var dataRc = {OSSC_PF:'', JINMEMO_MEMO:'', REMK_REMARK:''};
      this.$el.empty();
      //this.$el.off();
      this.$el.append($(_.template(bodyTpl)()));

      $panel = MH.panel(panelOpts);
      //$panel.find('.panel-heading').empty().append(new ChartIxHeader().render());
      $panel.find('.panel-heading').empty().append(headView.render());
      $panel.find('.panel-body').empty().append(this.$el);

      //$('#listSection .panel-heading').html(this.template());
    },

    render: function() {
      //console.log('ChartIx render called');
      //this.collection = new ChartIxs();
      //this.collection.fetch({async:false});
      this.collection.forEach(this.addOne, this);
    },

    addOne: function(item) {
      ////console.log('ChartIx addOne called');
      //this.$el.append(new PatientListItem({model:patient}).render().el);
      new ChartIxItem({model:item}).render();
    },

    changeId: function() {
      //console.log('chartDR rendering......');
      //this.collection.reset();
      //this.$el.off();
      if (GLOBAL.get('_CURPTID')) {
        this.patient = Patient.Patients.get(GLOBAL.get('_CURPTID'));  //@@@@@@@patient 변수로 지정

        this.collection = new ChartIxs();
        this.collection.fetch({async:false});
        this.blankIxs();
        this.render();

        headView.reRender();
      //$panel.find('.panel-heading').empty().append(headView.render());

      } else {
        console.log('blank chartID');
        this.blankIxs();
        this.render();
      }
    },

    blankIxs: function() {
      console.log('blank Ixs');
      var ixSeq = ['1', '2', '3'];
      for (var i=0;i<ixSeq.length;i++) {
        //if (!this.collection.get(group[i]) || !this.collection.get(group[i]).get('OPSC_MOMM_ID')) {
        if (!this.collection.get(ixSeq[i])) {
           this.collection.add({seq:ixSeq[i]});
        }
      }
    },

    events: {
      //'focus .ixName': 'checkEmpty',
      //'click .ixName': 'checkEmpty',
      //'keypress .ixName': 'searchIx',
      //'click .search-Ixs': 'selectIx',
      'click .js-shiftIx': 'shiftIx',
      //'click .js-delIx': 'delIx',
    },

    shiftIx: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var seq = $(e.target).attr('mH-seq');
      var json1 = _.omit( this.collection.get(seq).toJSON(), 'seq');
      var json2 = _.omit( this.collection.get(seq%3 + 1).toJSON(), 'seq');

      this.collection.get(seq).set(json2);
      this.collection.get(seq%3 + 1).set(json1);
    },


  });

//-----------------------------------------------------------------------------
// INSTANCES
//-----------------------------------------------------------------------------
  var headView = new ChartIxHeader();
  var bodyView = new ChartIxBody({collection: new ChartIxs()});

//-----------------------------------------------------------------------------
// RETURN
//-----------------------------------------------------------------------------
  return {
    headView: headView,
    bodyView: bodyView
  }

});