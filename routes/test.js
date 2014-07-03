var mH_utils = require('../mH_utils');

var _compareJson = function(req, res) {
/*
	//var col = 'daily';
  	var a = [
  		{"id":"001", "name":"name1", "age":45},
  		{"id":"002", "name":"name2", "age":35},
  		{"id":"003", "name":"name3", "age":25},
  		{"id":"004", "name":"name4", "age":15},
  		{"id":"005", "name":"name5", "age":75},
  	];

  	var b = [
  		{"id":"001", "name":"name1", "age":45},
  		{"id":"003", "name":"name3", "age":26},
  		{"id":"004", "name":"name04", "age":15},
  		{"id":"005", "name":"name5", "age":75},
  		{"id":"006", "name":"name6", "age":95},
  	];

*/

	mH_utils.compareJsonArr(req.body, function(rs){
	//mH_utils.mgCreateRs(req, function(rs) {
		console.log('_compareJsonArr with callback', req.body, rs);
		if (rs.error) {
			res.send(rs.error);
		} else {
			res.send(rs);
		}
	});

	//console.log('compare Json', mH_utils.compareJsonArr(a, b, 'id'));
	//res.send(mH_utils.compareJsonArr(a, b, 'id'));
	//mH_utils.compareJsonArr();
}

//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
exports.compareJson = _compareJson;
