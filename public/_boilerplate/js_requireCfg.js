//////************************************************************************
////// 이름:
////// 기능:
//////************************************************************************
require.config({

		//baseUrl path
    baseUrl: '../_assets/js/_lib',

    //path 지정: baseUrl 기준 상대 위치
    paths: {
        list: '../list',
        chart: '../chart',
        share: '../_share',
        tpl: '../../tpl',
        /*
        list_tpl: '../../tpl/list',
        share_tpl: '../../tpl/_share',
        UI_tpl: '../../tpl/_UI'
        */
    },

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
        },
        'bootstrap-modal': {
            deps: ['jquery'],
        },
    }
});

//bootstrap을 넣어야 다른 데서도 bootstrap이 되는지는 확인요@@@
require(['jquery', 'backbone', 'bootstrap', 'MH_utils', 'share/Global', 'list/router'], function ($, Backbone, bootstrap, MH, GLOBAL, Router) {
    var date = GLOBAL.get('_LISTDATE') || '';

    if (!date || !date.length) {
      date = MH.getToday();
    	GLOBAL.setListDate(date);
    }

    var app = new Router();
    Backbone.history.start();

});