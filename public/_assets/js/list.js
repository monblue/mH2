//////************************************************************************
////// 이름:    list.js
////// 기능:    moonHani list require config & chart start
//////************************************************************************
require.config({

    baseUrl: '../_assets/js/_lib',

    paths: {
        list: '../list',
        chart: '../chart',
        share: '../_share',
        list_tpl: '../../tpl/list',
        share_tpl: '../../tpl/_share',
        UI_tpl: '../../tpl/_UI'
    },
/*
    map: {
        '*': {
            //'app/models/employee': 'app/models/memory/employee'
        }
    },
*/
    shim: {
        'backbone.collectionsubset': {
            deps: ['underscore', 'jquery', 'backbone'],
            exports: 'Subset'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery'],
            //exports: 'Backbone'
        },
        'bootstrap-modal': {
            deps: ['jquery'],
            //exports: 'Backbone'
        },
    }
});

require(['jquery', 'backbone', 'bootstrap', 'MH_utils', 'share/Global', 'list/router'], function ($, Backbone, bootstrap, MH, GLOBAL, Router) {
/*
    var date = '';
    var arrUrl = document.location.href.split("#");
    if (arrUrl[1]) {
      date = arrUrl[1].substr(1);
    }
    //var date = arrUrl[1].substr(1);
    //var date = Backbone.history.fragment.substr(1);
    //console.log('date is', date.substr(1));
    if (!date || !date.length) {
      date = MH.getToday();
      document.location.replace(arrUrl[0] + '#L' + date);
      //Backbone.history.navigate('L' + date);
    }
    console.log('date is', date);
*/
    //GLOBAL.setListDate('20140515');
    date = MH.getToday();
    GLOBAL.setListDate(date);
    //var app = new Router(date);
    var app = new Router();
    Backbone.history.start();

});