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
    date = MH.getToday();
    GLOBAL.setListDate(date);
    var app = new Router();
    Backbone.history.start();

});