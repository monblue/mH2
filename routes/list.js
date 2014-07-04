var mH_utils = require('../mH_utils');
var async = require('async');


var _createPatientsMG = function(req, res) {
	mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'daily'}, function(err, rs){
		res.send(rs);
	});

}


var _readAllPatientsMG = function(req, res) {
	mH_utils.mgReadAllRs({"filter":{"date":req.params.date}, "col":'daily'}, function(err, rs){
		res.send(rs);
	});
}


var _readAllPatientsMS = function(req, res) {
  var que = _readPatientsMSQue({"date":req.params.date, "type":'all'});
	mH_utils.msQueryRs({"que":que}, function(err, rs){
		res.send(rs);
	});
}


var _readOnePatientsMS = function(req, res) {
  var que = _readPatientsMSQue({"date":req.params.date, "CHARTID":req.params.id, "type":'one'});
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}


var _readOnePatientsMG = function(req, res) {
	mH_utils.mgReadOneRs({"filter":{"date":req.params.date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
		res.send(rs);
	});
}


var _updatePatientsMG = function(req, res) {
	mH_utils.mgUpdateRs({"body":req.body, "filter":{"date":req.params.date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
		res.send(rs);
	});
}


var _deletePatientsMG = function(req, res) {
	mH_utils.mgDeleteRs({"filter":{"date":req.params.date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
		res.send(rs);
	});
}





var _getPatientsSyncMG = function(req, res) {
  //CHARTID, KSTATE, LAST, LAST2, BNUM, BTIME, BONBU, TOTAL, BIBO, ORDER1
  var fields = { CHARTID: 1, KSTATE: 1, LAST: 1, LAST2: 1, BNUM: 1, BTIME: 1, BONBU: 1, TOTAL: 1, BIBO: 1, ORDER1: 1, _id: 0 };
  mH_utils.mgReadFieldsRs({"filter":{"date":req.params.date}, "fields":fields, "col":'daily'}, function(err, rs){
    res.send(rs);
  });

}


var _getPatientsSyncMS = function(req, res) {
  var que = _readPatientsMSQue({"date":req.params.date, "type":'sync'});
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}


var _syncPatientsMSMG = function(req, res) {
  var date = req.params.date;

  async.parallel([
    function(callback) {
      var que = _readPatientsMSQue({"date":date, "type":'sync'});
      console.log(que);
      mH_utils.msQueryRs({"que":que}, function(err, rs){
        callback(null, rs);
      });
    },

    function(callback) {
      var fields = { CHARTID: 1, KSTATE: 1, LAST: 1, LAST2: 1, BNUM: 1, BTIME: 1, BONBU: 1, TOTAL: 1, BIBO: 1, ORDER1: 1, _id: 0 };
      mH_utils.mgReadFieldsRs({"filter":{"date":date}, "fields":fields, "col":'daily'}, function(err, rs){
        //console.log('_readAllPatientsMG with callback', rs);
        callback(null, rs);
      });
    }
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    console.log(results[0], results[1]);
    mH_utils.compareJsonArr({"a":results[0], "b":results[1], "key":"CHARTID"}, function(updated) {

    	if (updated.num) {
    		console.log('MSData is updated!!! update event will be triggered!!!');

	      var added = updated.add;
	      if (added.length) {
	        console.log('added array', updated.added);

	        for(i in added) {
	          //@@@@@ id로 상세 환자정보 얻어내고 mongodb에 insert
	          _syncAdd({"id":added[i].CHARTID, "date":date, "res":res}, function(err, rs) {
	            res.send(rs);
	          });
	        }
	      }

    	} else {
    		console.log('MSData is not updated!!!');
    	}

    });

  });

}


var _syncAdd = function(opts, cb) {
  var date = opts.date;
  var id = opts.id;
  var res = opts.res;
  var que = _readPatientsMSQue({"date":date, "id":id, "type":'one'});

	async.waterfall([
	  function(callback) {
      mH_utils.OHISNum(id, function(ohis){	//OHIS 구하기
  			var que2 = "SELECT CAP_PATH, CAP_WDATE, CAP_REMARK, CAP_BIGO1 FROM OHIS_H.dbo.IM_CAP"
  					+ ohis
  					+ " WHERE CAP_CHAM_ID = '"
  					+ id
  					+ "' ORDER BY CAP_SEQ DESC";
	      callback(null, que2);
	    });
	  },

	  function(que2, callback) {	//PIC data 구하기
	  	mH_utils.msQueryRs({"que":que2}, function(err, rs){
	  		if (!rs) {
	  			rs = [{}];
	  		};
        callback(err, rs);
      });
	  },

	  function(picRs, callback) {  //해당 id 환자정보 구하기
	  	mH_utils.msQueryRs({"que":que}, function(err, rs){
	  		rs[0].PIC = picRs;
	  		rs[0].date = date;
	  		rs[0].SAVED = {"RC":0, "IX":0, "TX":0};	//@@@@@@@@@@@@@@@
	  		rs[0].CHARTED = {"TOTAL":0,"BIBO":0};
        callback(err, rs[0]);
      });
	  },

	    //var defaultData
	    /*
	            `SAVEDRC` smallint,  //0: 저장전, 1: 저장후
	            `SAVEDIX` smallint,  //0: 저장전, 1: 저장후
	            `SAVEDTX` smallint,  //0: 저장전, 1: 저장후
	            `CHARTED` varchar(100), //{"TOTAL":0,"BIBO":0,}
	            `PIC` varchar(10000)  //[{},{}]@@@@@@@@@@@
	    */
	  function(data, callback) {
	  	mH_utils.mgCreateRs({"body":data, "date":date, "col":'daily'}, function(err, rs){
	      callback(err, rs);
	    });
	  },

	],

	function(err, results) {
	  //console.log(arguments);
	  console.log(results);
	  cb(err, results);
	});

}



//-----------------------------------------------------------------------------
// get Query
//-----------------------------------------------------------------------------
var _readPatientsMSQue = function(opts) {
  var date = opts.date || '20140704';
  var id = opts.id || '';
  var type = opts.type || 'all';
	//var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  var month = date.substring(0,6);

  var arrSelQue1 = [	//sync check용
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

	var arrSelQue2 = [
		//"cham.CHAM_ID AS CHARTID",
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
		//"jubm.JUBM_GICHO1 AS KSTATE",
		//"substring(jubm.JUBM_GICHO2, 1, 2) AS BNUM",
		//"substring(jubm.JUBM_GICHO2, 3, 4) AS BTIME",
		//"jubm.JUBM_IRAMT AS BONBU",
		//"jubm.JUBM_MTAMT AS TOTAL",
		//"jubm.JUBM_BIGUB AS BIBO",
		//"jubm.JUBM_TODAY AS ORDER1",
		"swam.SWAM_DATE AS FIRSTDATE",
		"kwam.KWAM_DATE AS LASTDATE",
		"kwam.KWAM_DATE_AF AS LASTDATE2",
		//"datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112)) AS LAST",
		//"datediff(day, kwam.KWAM_DATE_AF, convert(char(8), Getdate(), 112)) AS LAST2",
		"post.POST_NAME1 + ' ' + post.POST_NAME2 + ' ' + post.POST_NAME3 + ' ' + cham.CHAM_JUSO AS ADDRESS"
	];


  var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham"
  						+ " INNER JOIN Month.dbo.JUBM" + month + " AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID"
  						+ " LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID"
  						+ " LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID"
  						+ " LEFT OUTER JOIN hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY";

  var where = " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";


  if (type == 'sync') {
    extra = " FROM Month.dbo.JUBM"
              + month
              + " AS jubm"
              + " LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON jubm.JUBM_CHAM_ID = kwam.KWAM_CHAM_ID"
  };


  if (type == 'one') {
    where = " WHERE jubm.JUBM_DATE = '"
              + jdate
              + "' AND jubm.JUBM_CHAM_ID = '"
              + id
              + "' ORDER BY jubm.JUBM_JUBSU_TIME DESC";
  };

  if (type == 'sync') {
  	arrSelQue = arrSelQue1;
  } else {
  	arrSelQue = arrSelQue1.concat(arrSelQue2);
  }

  //var query = "SELECT " + arrSelQue.join(', ') + extra + where;
  return "SELECT " + arrSelQue.join(', ') + extra + where;
}


//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
exports.createPatients = _createPatientsMG;
exports.readAllPatients = _readAllPatientsMG;
//exports.readAllPatients = _readAllPatientsMS;
exports.readOnePatients = _readOnePatientsMG;
//exports.readOnePatients = _readOnePatientsMS;
exports.updatePatients = _updatePatientsMG;
exports.deletePatients = _deletePatientsMG;

//exports.fetch = _getPatientsSyncMS;
exports.fetch = _syncPatientsMSMG;




/*

function searchPatientMS() {
  //$_REQUEST[]
  $where = 'WHERE ';
  $andWhere = '';
  //$arrWhere = array();
  $name = $_REQUEST['name'];
  $tel = $_REQUEST['tel'];
  $jumin = $_REQUEST['jumin'];
  //print_r($_REQUEST['name']);

  if ($name) {
      $arrWhere['name'] = " cham.CHAM_WHANJA LIKE '%$name%' ";
  }

  if ($tel) {
      $arrWhere['tel'] = " ( cham.CHAM_TEL LIKE '%$tel' OR cham.CHAM_HP LIKE '%$tel') ";
  }

  if ($jumin) {
      $arrWhere['jumin'] = " cham.CHAM_PASSWORD LIKE '%$jumin%' ";
  }

  $where = ' WHERE ' . implode(' AND ', $arrWhere);
  //print_r($where . "\n<br>");

  $sql = "SELECT TOP 10
      cham.CHAM_ID AS CHARTID,
      cham.CHAM_JEJU AS JEJUCODE,
      cham.CHAM_WHANJA AS NAME,
      cham.CHAM_SEX AS SEX,
      cham.CHAM_TEL AS TEL,
      cham.CHAM_HP AS HP,
      substring(cham.CHAM_PASSWORD, 1, 6) AS JUMIN,
      hanimacCS.dbo.UF_getAge3(cham.CHAM_PASSWORD, convert(char(8), Getdate(), 112)) AS AGE,
      cham.CHAM_PART AS PART,
      cham.CHAM_DAE AS DAE,
      cham.CHAM_JEUNG AS JEUNG,
      kwam.KWAM_DATE AS LASTDATE,
      cham.CHAM_읍면동명 AS ADDRESS
      FROM hanimacCS.dbo.CC_CHAM AS cham
      INNER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID "
      . $where .
      " ORDER BY kwam.KWAM_DATE DESC";
  //echo $sql;
  //echo json_encode(mH_selectArrayMSSQL($sql));
  $rs =  mH_selectArrayMSSQL($sql);

  foreach($rs as &$val) {
    //print_r('id:' . $val['CHARTID']);
    $val['PIC'] = json_encode(_getPatientPhotoMS($val['CHARTID']));
    //$arrType = explode('|', $val['TYPE']);
    $val['ITYPE'] = mH_InsuType($val['PART'], $val['DAE'], $val['JEUNG']);
    //$val['age'] = _getPatientAge($yy, $jumin01);
    //$val['itype'] = _getPatientIType($insPart, $insDae, $insJeung);
  }

  echo json_encode($rs);
}
*/