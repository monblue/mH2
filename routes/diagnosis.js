var mH_utils = require('../mH_utils');
//var async = require('async');
var dateFormat = require('dateformat');
var _ = require('underscore');

//_syncAdd
/*
var _readAllDiagnosissMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgReadAllRs({"chartId":req.params.id}, "col":'diagnosis'}, function(err, rs){
    res.send(rs);
  });
}

*/

var _createDiagnosisMG = function(req, res) {
  mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'diagnosis'}, function(err, rs){
    res.send(rs);
  });
}


var _readOneDiagnosisMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgReadOneRs({"filter":{"date":date, "chartId":req.params.id}, "col":'diagnosis'}, function(err, rs){
  	// _id, chartId, date를 rs 에서 제외하는 방법은????@@@@@@@@@
    res.send(rs);
  });
}


var _updateDiagnosisMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgUpdateRs({"body":req.body, "filter":{"date":date, "chartId":req.params.id}, "col":'diagnosis'}, function(err, rs){
    res.send(rs);
  });
}


var _deleteDiagnosisMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgDeleteRs({"filter":{"date":date, "chartId":req.params.id}, "col":'diagnosis'}, function(err, rs){
    res.send(rs);
  });
}

exports.createDiagnosis = _createDiagnosisMG;
exports.readOneDiagnosis = _readOneDiagnosisMG;
//exports.readAllDiagnosis = _readAllDiagnosisMG;
exports.updateDiagnosis = _updateDiagnosisMG;
exports.deleteDiagnosis = _deleteDiagnosisMG;