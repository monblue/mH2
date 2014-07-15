define(function (require) {
    //"use strict";
    var $           = require('jquery');
    //var _           = require('underscore');
    var Backbone    = require('backbone');
    var GLOBAL      = require('share/Global');
    var Subset      = require('backbone.collectionsubset');

    var Patient = Backbone.Model.extend({
/*
            defaults:{
                //id:null,
                //CHARTED:'{}',
            },
*/
            idAttribute: 'CHARTID',
            urlRoot: function() {
              //return GLOBAL.get('_BASEURL') + 'API/list/patients/' + GLOBAL.get('_LISTDATE');
              return GLOBAL.get('_BASEURL') + 'patients/' + GLOBAL.get('_LISTDATE');
              //return GLOBAL.get('_BASEURL') + 'patients/' + '20140713';
            },
        });

    var PatientCollection = Backbone.Collection.extend({
            model: Patient,
            url: function() {
              //return GLOBAL.get('_BASEURL') + 'API/list/patients/' + GLOBAL.get('_LISTDATE');
              return GLOBAL.get('_BASEURL') + 'patients/' + GLOBAL.get('_LISTDATE');
              //return GLOBAL.get('_BASEURL') + 'patients/' + '20140713';
            },
            initialize: function() {
                this.fetch({async:false});
                //console.log('PatientCollection initialize!!!!!!!!!!');
                //this.
                this.listenTo(this, 'add', this.testListen);
            },
            addListener: function() {
                //console.log('PatientCollection added', this.toJSON());
            }
        });

    var patients = new PatientCollection();

    var patientsSubset = patients.subcollection({
            filter: function(patient) {

                //console.log('patientsSubset filtering');
                switch(GLOBAL.get('_RMSTATE')) {
                case '대기':
                    return patient.get('KSTATE') === '진료대기';
                    break;
                case '치료':
                    return (patient.get('KSTATE') === '치료대기' || patient.get('KSTATE') === '치료베드');
                    break;
                /*
                case '수납':
                    return patient.get('KSTATE') === '수납대기';
                    break;
                */
                case '완료':
                    return (patient.get('KSTATE') === '수납대기' || patient.get('KSTATE') === '보험환자' || patient.get('KSTATE') === '일반환자');
                    break;
                default:
                    return patient.get('KSTATE') === '진료대기';
                    break;
                }

                //return patient.get('tstate') === GLOBAL.get('_TXSTATE');
            }
        });

    return {
        Patients: patients,
        PatientsSubset: patientsSubset
    };

});