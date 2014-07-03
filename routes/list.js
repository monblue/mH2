var mH_utils = require('../mH_utils');

var _createPatientsMg = function(req, res) {
	//var col = 'daily';
	mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'daily'}, function(rs){
	//mH_utils.mgCreateRs(req, function(rs) {
		console.log('_createPatientsMg with callback', req.body, rs);
		if (rs.error) {
			res.send(rs.error);
		} else {
			res.send(rs);
		}
	});

}


var _readAllPatientsMg = function(req, res) {
	mH_utils.mgReadAllRs({"filter":{"date":req.params.date}, "col":'daily'}, function(rs){
		console.log('_readAllPatientsMg with callback', rs);
		res.send(rs);
	});
}


var _readAllPatientsMS = function(req, res) {
  var que = _readAllPatientsMSQue(req.params.date);

	mH_utils.msQueryRs({"que":que}, function(rs){
		console.log('_readAllPatientsMS with callback', rs);
		res.send(rs);
		//res.send(que);
	});
}


var _readOnePatientsMg = function(req, res) {
	mH_utils.mgReadOneRs({"filter":{"date":req.params.date, "id":req.params.id}, "col":'daily'}, function(rs){
		console.log('_readOnePatientsMg with callback', rs);
		res.send(rs);
	});
}


var _updatePatientsMg = function(req, res) {
	mH_utils.mgUpdateRs({"body":req.body, "filter":{"date":req.params.date, "id":req.params.id}, "col":'daily'}, function(rs){
		console.log('_updatePatientsMg with callback', rs);
		res.send(rs);
	});
}


var _deletePatientsMg = function(req, res) {
	mH_utils.mgDeleteRs({"filter":{"date":req.params.date, "id":req.params.id}, "col":'daily'}, function(rs){
		console.log('_deletePatientsMg with callback', rs);
		res.send(rs);
	});
}

//-----------------------------------------------------------------------------
// get Query
//-----------------------------------------------------------------------------
var _readAllPatientsMSQue = function(date) {
	var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  var month = date.substring(0,6);

	var arrSelQue = [
		"cham.CHAM_ID AS CHARTID",
		"cham.CHAM_CHARTNUM AS chartNum",
		"cham.CHAM_JEJU AS JEJUCODE",
		"cham.CHAM_WHANJA AS NAME",
		"cham.CHAM_SEX AS SEX",
		"substring(cham.CHAM_PASSWORD, 1, 6) AS jumin01",
		"hanimacCS.dbo.UF_getAge3(cham.CHAM_PASSWORD, convert(char(8), Getdate(), 112)) AS AGE",
		"cham.CHAM_YY AS yy",
		"cham.CHAM_PART AS PART",
		"cham.CHAM_DAE AS DAE",
		"cham.CHAM_JEUNG AS JEUNG",
		"cham.CHAM_TEL AS telNum",
		"cham.CHAM_HP AS hpNum",
		"cham.CHAM_BOHOJA AS bohoja",
		"cast(cham.CHAM_MEMO AS text) AS memo",
		"cham.CHAM_읍면동명 AS ADDRESS2",
		"jubm.JUBM_JUBSU_TIME AS JTIME",
		"jubm.JUBM_GICHO1 AS KSTATE",
		"substring(jubm.JUBM_GICHO2, 1, 2) AS BNUM",
		"substring(jubm.JUBM_GICHO2, 3, 4) AS BTIME",
		"jubm.JUBM_IRAMT AS BONBU",
		"jubm.JUBM_MTAMT AS TOTAL",
		"jubm.JUBM_BIGUB AS BIBO",
		"jubm.JUBM_TODAY AS ORDER1",
		"swam.SWAM_DATE AS FIRSTDATE",
		"kwam.KWAM_DATE AS LASTDATE",
		"kwam.KWAM_DATE_AF AS LASTDATE2",
		"datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112)) AS LAST",
		"datediff(day, kwam.KWAM_DATE_AF, convert(char(8), Getdate(), 112)) AS LAST2",
		"post.POST_NAME1 + ' ' + post.POST_NAME2 + ' ' + post.POST_NAME3 + ' ' + cham.CHAM_JUSO AS ADDRESS"
	];

	var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  Month.dbo.JUBM"
							+ month
							+ " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY WHERE jubm.JUBM_DATE = '"
							+ jdate
							+ "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";

	var query = "SELECT " + arrSelQue.join(', ') + extra;
	//console.log('select query', query);
  return query;
}


//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
exports.createPatients = _createPatientsMg;
exports.readAllPatients = _readAllPatientsMg;
//exports.readAllPatients = _readAllPatientsMS;
exports.readOnePatients = _readOnePatientsMg;
exports.updatePatients = _updatePatientsMg;
exports.deletePatients = _deletePatientsMg;

/*
exports.readAllPatients = function(req, res) {
	mH_utils.mgReadAllRs({"filter":{"date":req.params.date}, "col":'daily'}, function(rs){
		console.log('readAll with callback', rs);
		res.send(rs);
	});
}
*/