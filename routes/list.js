var mH_utils = require('../mH_utils');
var async = require('async');


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
  var que = _readPatientsMSQue({"date":req.params.date, "type":'all'});
  console.log(que);

	mH_utils.msQueryRs({"que":que}, function(rs){
		console.log('_readAllPatientsMS with callback', rs);
		res.send(rs);
		//res.send(que);
	});
}


var _readOnePatientsMS = function(req, res) {
  var que = _readPatientsMSQue({"date":req.params.date, "id":req.params.id, "type":'one'});
  console.log(que);

  mH_utils.msQueryRs({"que":que}, function(rs){
    console.log('_readOnePatientsMS with callback', rs);
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





var _getPatientsSyncMG = function(req, res) {
  //var fields = { user_id: 1, status: 1, _id: 0 };
  //CHARTID, KSTATE, LAST, LAST2, BNUM, BTIME, BONBU, TOTAL, BIBO, ORDER1
  var fields = { CHARTID: 1, KSTATE: 1, LAST: 1, LAST2: 1, BNUM: 1, BTIME: 1, BONBU: 1, TOTAL: 1, BIBO: 1, ORDER1: 1, _id: 0 };
  mH_utils.mgReadFieldsRs({"filter":{"date":req.params.date}, "fields":fields, "col":'daily'}, function(rs){
    console.log('_readAllPatientsMg with callback', rs);
    res.send(rs);
  });

}


var _getPatientsSyncMS = function(req, res) {
  var que = _getPatientsSyncMSQue(req.params.date);

  mH_utils.msQueryRs({"que":que}, function(rs){
    console.log('__getPatientsSyncMS with callback', rs);
    res.send(rs);
    //res.send(que);
  });
}


/*
var syncPatientsMSMG = function(req, res) {
  // async 이용
  //getPatientsSyncMS
  //compareJsonArr = function(opts, cb) {
}
*/

var _syncPatientsMSMG = function(req, res) {
  var date = req.params.date;

  async.parallel([
    function(callback) {
      var que = _getPatientsSyncMSQue(date);
      mH_utils.msQueryRs({"que":que}, function(rs){
        callback(null, rs);
      });
    },

    function(callback) {
      var fields = { CHARTID: 1, KSTATE: 1, LAST: 1, LAST2: 1, BNUM: 1, BTIME: 1, BONBU: 1, TOTAL: 1, BIBO: 1, ORDER1: 1, _id: 0 };
      mH_utils.mgReadFieldsRs({"filter":{"date":date}, "fields":fields, "col":'daily'}, function(rs){
        console.log('_readAllPatientsMg with callback', rs);
        callback(null, rs);
      });
    }
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    //console.log(arguments);
    console.log(results[0], results[1]);
    //res.send(results[1]);

    mH_utils.compareJsonArr({"a":results[0], "b":results[1], "key":"CHARTID"}, function(updated) {
      res.send(updated);
      var added = updated.add;
      if (added.length) {
        console.log('added array', updated.added);
        for(i in added) {
          //@@@@@ id로 상세 환자정보 얻어내고 mongodb에 insert
          //{"id":added[i].CHARTID, "date":date}
          //msRead
          //_syncAdd(opts, cb)
          _syncAdd({"id":added[i].CHARTID, "date":date, "res":res}, function(rs) {
            res.send(rs);
          });
          /*
          mH_utils.mgCreateRs({"body":added[i], "date":date, "col":'daily'}, function(rs){
          //mH_utils.mgCreateRs(req, function(rs) {
            //console.log('_createPatientsMg with callback', req.body, rs);
            if (rs.error) {
              res.send(rs.error);
            } else {
              res.send(rs);
            }
          });
          */
        }
      }

    });

    //console.log(results[1]);
    //cb({"add":arrAdd, "del":arrDel, "upd":arrUpd});
    /*
    mH_utils.compareJsonArr({"a":results[1], "b":results[0], "key":"id"}, function(updated) {
      if (updated.added) {
        //_syncAddMSMG(updated.added);
      }
      //res.send(updated);
    });
    */
  });

}


var _syncAdd = function(opts, cb) {
  var date = opts.date;
  var id = opts.id;
  var res = opts.res;
  var que = _readPatientsMSQue({"date":date, "id":id, "type":'one'});
  mH_utils.msQueryRs({"que":que}, function(rs){
    var data = rs[0];
    //PIC data
    /*
      $OHIS = mH_OHISNum($id);
      $sql = "SELECT CAP_PATH, CAP_WDATE, CAP_REMARK, CAP_BIGO1 FROM OHIS_H.dbo.IM_CAP$OHIS
      WHERE CAP_CHAM_ID = '$id'
      ORDER BY CAP_SEQ DESC";
    */
    //var defaultData
    /*
            `SAVEDRC` smallint,  //0: 저장전, 1: 저장후
            `SAVEDIX` smallint,  //0: 저장전, 1: 저장후
            `SAVEDTX` smallint,  //0: 저장전, 1: 저장후
            `CHARTED` varchar(100), //{"TOTAL":0,"BIBO":0,}
            `PIC` varchar(10000)  //[{},{}]@@@@@@@@@@@
    */
    mH_utils.mgCreateRs({"body":data, "date":date, "col":'daily'}, function(rs2){
      cb(rs2);
      /*
      if (rs2.error) {
        res.send(rs2.error);
      } else {
        res.send(rs2);
      }
      */
    });
  });
}



//------------------------------------------------------------------------------

/*
function syncPatientsMSMY($date) {
  $updated = mH_checkUpdate(_getPatientsSyncMY($date), _getPatientsSyncMS($date), 'CHARTID');
  if ($updated === 'init') {
      foreach (_getPatientsMS($date) as $patient) {
          _addPatientMY($date, $patient);
      }

  } else {
      if (!empty($updated['del'])) {
          _delPatientSyncMY($date, $updated['del']);
      }
      if (!empty($updated['add'])) {
          _addPatientSyncMY($date, $updated['add']);
      }
      if (!empty($updated['upd'])) {
          _updPatientSyncMY($date, $updated['upd']);
      }
  }

}




var _getPatientsSyncMs = function(date) {
  $sql = "SELECT CHARTID, KSTATE, LAST, LAST2, BNUM, BTIME, BONBU, TOTAL, BIBO, ORDER1
          FROM `patient_$date`
          ORDER BY name";
  var que = _readAllPatientsMSQue(req.params.date);

  mH_utils.msQueryRs({"que":que}, function(rs){
    console.log('_readAllPatientsMS with callback', rs);
    res.send(rs);
    //res.send(que);
  });
}
*/
//-----------------------------------------------------------------------------
// get Query
//-----------------------------------------------------------------------------
var _readPatientsMSQue = function(opts) {
  var date = opts.date || '20140704';
  var id = opts.id || '';
  var type = opts.type || 'all';
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

/*
  var extra = {
    "from":" FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  Month.dbo.JUBM"
              + month
              + " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID",
    "join":" LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY",
    "where":"" WHERE jubm.JUBM_DATE = '" + jdate + "'",
    "order":"' ORDER BY jubm.JUBM_JUBSU_TIME DESC"
  };



  var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  Month.dbo.JUBM"
              + month
              + " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID LEFT OUTER JOIN hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY"
              + " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";

  var query = "SELECT " + arrSelQue.join(', ') + extra;




	var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  Month.dbo.JUBM"
							+ month
							+ " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID LEFT OUTER JOIN hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY";

  var where = " WHERE jubm.JUBM_DATE = '"
							+ jdate
							+ "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";

  if (type == 'one') {
    where = " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' AND jubm.JUBM_CHAM_ID = '"
              + id
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";
  };

  var query = "SELECT " + arrSelQue.join(', ') + extra + where;

*/
  var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  Month.dbo.JUBM"
              + month
              + " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID LEFT OUTER JOIN hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY";

  var where = " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";

  if (type == 'one') {
    where = " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' AND jubm.JUBM_CHAM_ID = '"
              + id
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";
  };

  var query = "SELECT " + arrSelQue.join(', ') + extra + where;
  return query;
}



var _getPatientsSyncMSQue = function(date) {
  var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  var month = date.substring(0,6);

  var arrSelQue = [
    "jubm.JUBM_CHAM_ID AS CHARTID",
    "jubm.JUBM_GICHO1 AS KSTATE",
    "datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112)) AS LAST",
    "datediff(day, kwam.KWAM_DATE_AF, convert(char(8), Getdate(), 112)) AS LAST2",
    "substring(jubm.JUBM_GICHO2, 1, 2) AS BNUM",
    "substring(jubm.JUBM_GICHO2, 3, 4) AS BTIME",
    "jubm.JUBM_IRAMT AS BONBU",
    "jubm.JUBM_MTAMT AS TOTAL",
    "jubm.JUBM_BIGUB AS BIBO",
    "jubm.JUBM_TODAY AS ORDER1"
  ];

  var extra = " FROM Month.dbo.JUBM"
              + month
              + " AS jubm"
              + " LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON jubm.JUBM_CHAM_ID = kwam.KWAM_CHAM_ID"
              + " WHERE jubm.JUBM_DATE = '"
              + jdate
              //+ "' AND jubm.JUBM_GICHO1 LIKE '치료%"
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";

  var query = "SELECT " + arrSelQue.join(', ') + extra;
  console.log('select query', query);
  return query;
}


//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
exports.createPatients = _createPatientsMg;
exports.readAllPatients = _readAllPatientsMg;
//exports.readAllPatients = _readAllPatientsMS;
exports.readOnePatients = _readOnePatientsMg;
//exports.readOnePatients = _readOnePatientsMS;
exports.updatePatients = _updatePatientsMg;
exports.deletePatients = _deletePatientsMg;

//exports.fetch = _getPatientsSyncMS;
exports.fetch = _syncPatientsMSMG;

/*
exports.readAllPatients = function(req, res) {
	mH_utils.mgReadAllRs({"filter":{"date":req.params.date}, "col":'daily'}, function(rs){
		console.log('readAll with callback', rs);
		res.send(rs);
	});
}
*/