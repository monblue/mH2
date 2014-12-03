var mH_utils = require('../mH_utils');
var async = require('async');
var dateFormat = require('dateformat');
var _ = require('underscore');

//_syncAdd



var _createPatient = function(req, res) {
  //var que = _createPatientMSQue({"date":req.params.date, "data":req.body, "type":'jubsu'});

  var opts = {
    "date":req.params.date,
    "id":req.body.CHARTID,
    "user":req.body.user,
    "type":'jubsu'
  };
/*
  var opts = {
    "date":req.params.date,
    "id":req.params.id,
    "user":req.body.user,
    "type":'jubsu'
  };
*/
  _createPatientMSQue(opts, function(que){
    //console.log(que);
    mH_utils.msQueryRs({"que":que}, function(err, rs){
      _syncAdd(opts, function(err, rs){
        mH_utils.mgReadOneRs({"filter":{"date":opts.date, "CHARTID":opts.id}, "col":'daily'}, function(err, rs){  //patient data res.send
            res.send(rs);
        });
      });
    });
  });


  //var que = _createPatientMSQue(opts);
/*
  mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
*/
}


function _createPatientMSQue(opts, cb) {
  //echo('Server addPatient' . date . id . user );
  //'120205310408506', '1002XX3XX4XX5XX'
  //JUBM_JU_NIGHT : 야간?
  //JUBM_CHAMGO: 한의맥 청구 [참조]
  //초재진 자동 생성(90일 기준) 함수로 만듬(KWAM_DATE 와 비교) //datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112))
  //청구 입력시 청구 내용에 맞추어 자동으로 바뀌므로 재진(10200)으로 그냥 두어도 됨
/*
  var date = '20140715';
  var id = '0000001234';
  var user = 'N01';
*/
  var date = opts.date;
  var id = opts.id;
  var user = opts.user;

  var month = date.substr(0, 6);
  var date_ = date.substr(6, 2);
  //var time = '0912';  h:MM:ss
  //var magam = 15;    //JUBM_MAGAM data가 이것이 맞는지는 확실치 않음!!!!!!!!!!
  var oDate = new Date();
  time = dateFormat(oDate, "HHMM");
  magam = dateFormat(oDate, "s");;    //JUBM_MAGAM data가 이것이 맞는지는 확실치 않음!!!!!!!!!!

  var arrIns = {
    "JUBM_MEDM_ID":'0',  ////insDefaults
    "JUBM_RNO":'0',
    "JUBM_MTAMT":'0',
    "JUBM_MRAMT":'0',
    "JUBM_IRAMT":'0',
    "JUBM_BIGUB":'0',
    "JUBM_HAAMT":'0',
    "JUBM_JINSUAMT":'0',
    "JUBM_JINSUAMT1":'0',
    "JUBM_JINSUAMT2":'0',
    "JUBM_SUAMT":'0',
    "JUBM_MISU_AMT":'0',
    "JUBM_WAAMT":'0',
    "JUBM_GICHO1":'진료대기',
    "JUBM_TIME":'',
    "JUBM_CHAMGO":'',
    "JUBM_JU_NIGHT":'0',
    "JUBM_CARD_AMT":'0',
    "JUBM_CARD_USE":'0',
    "JUBM_SUNAB_S":'0',
    "JUBM_BIGO1":'120205310408506',
    "JUBM_BIGO2":'1002XX3XX4XX5XX',
    "JUBM_CHAM_ID":id,  ////insVariables
    "JUBM_DATE":date_,
    "JUBM_CHOJE_CODE":'10200',  //초진, 재진 구분@@@@@@@@@@@@@@@
    "JUBM_MAGAM":magam,
    "JUBM_JUBSU_TIME":time,
    "JUBM_USRM_ID":user,
    //"JUBM_GWAM_ID":"",  ////insSelects
    //"JUBM_PART":"",
    //"JUBM_ORGM_ID":"",
    //"JUBM_JEUNG":"",
    //"JUBM_DAE":"",
    //"JUBM_DOC_ID":"",
    //"JUBM_FLAG":""
  }

  var arrIns2 = {
    "JUBM_GWAM_ID":'kwam.KWAM_GWAM_ID',
    "JUBM_PART":'cham.CHAM_PART',
    "JUBM_ORGM_ID":'cham.CHAM_ORGM_ID',
    "JUBM_JEUNG":'cham.CHAM_JEUNG',
    "JUBM_DAE":'cham.CHAM_DAE',
    "JUBM_DOC_ID":'kwam.KWAM_USRM_ID',
    "JUBM_FLAG":'kwam.KWAM_FLAG'
  }

  var keys = " (" + _.keys(arrIns).join(', ') + ", " +
            _.keys(arrIns2).join(', ') + ")";
  var vals = "'" + _.values(arrIns).join("', '") + "', " +
            _.values(arrIns2).join(", ");

  var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID WHERE cham.CHAM_ID = '" + id + "'";

  var que = "INSERT INTO Month.dbo.JUBM" + month + keys + " SELECT " + vals + extra;

  //console.log(que);

  cb(que);

}

/*
var _createPatientMG = function(req, res) {
  mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
}

var _createPatientMS = function(req, res) {
  mH_utils.mgCreateRs({"body":req.body, "date":req.params.date, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
}
*/
/*

function addPatient(date) {

  data = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));

  //MSSQL add: 신환은 추후 따로 구현 / 접수는 따로(?) 구현
  arrPatient = _addPatientMS(date, data);
  //MYSQL add
  //arrPatient = _addPatient(date, id, user);
  sql = "INSERT INTO `patient_date` " . mH_getInsStr(arrPatient);
  //echo sql;

  mH_executeMYSQL(sql);
  echo json_encode(arrPatient);

}


function _addPatientMS(date, data) {
  //user???
  //user = _REQUEST['user'];
  id = data['CHARTID'];
  user = data['user'];
  month = substr(date, 0, 6);
  date_ = substr(date, 6, 2);
  time = date("Hi");
  magam = (int)date("s");    //JUBM_MAGAM data가 이것이 맞는지는 확실치 않음!!!!!!!!!!
  //echo('Server addPatient' . date . id . user );
  //'120205310408506', '1002XX3XX4XX5XX'
  //JUBM_JU_NIGHT : 야간?
  //JUBM_CHAMGO: 한의맥 청구 [참조]
  //초재진 자동 생성(90일 기준) 함수로 만듬(KWAM_DATE 와 비교) //datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112))
  //청구 입력시 청구 내용에 맞추어 자동으로 바뀌므로 재진(10200)으로 그냥 두어도 됨

  sql = "INSERT INTO Month.dbo.JUBMmonth
          (JUBM_MEDM_ID, JUBM_CHAM_ID, JUBM_GWAM_ID, JUBM_DATE,
          JUBM_RNO, JUBM_CHOJE_CODE, JUBM_PART, JUBM_ORGM_ID, JUBM_JEUNG, JUBM_DAE,
          JUBM_MTAMT, JUBM_MRAMT, JUBM_IRAMT, JUBM_BIGUB, JUBM_HAAMT, JUBM_JINSUAMT,
          JUBM_JINSUAMT1, JUBM_JINSUAMT2, JUBM_SUAMT, JUBM_MISU_AMT, JUBM_WAAMT,
          JUBM_GICHO1, JUBM_TIME, JUBM_CHAMGO, JUBM_JU_NIGHT, JUBM_CARD_AMT, JUBM_CARD_USE,
          JUBM_MAGAM, JUBM_JUBSU_TIME, JUBM_DOC_ID, JUBM_USRM_ID, JUBM_FLAG,
          JUBM_SUNAB_S, JUBM_BIGO1, JUBM_BIGO2)

          SELECT
          '0', 'id', kwam.KWAM_GWAM_ID, 'date_',
          '0', '10200',
          cham.CHAM_PART,
          cham.CHAM_ORGM_ID,
          cham.CHAM_JEUNG,
          cham.CHAM_DAE,
          '0', '0', '0', '0', '0', '0',
          '0', '0', '0', '0', '0',
          '진료대기', '', '', '0', '0', '0',
          'magam', 'time',  kwam.KWAM_USRM_ID, 'user', kwam.KWAM_FLAG,
          '0', '120205310408506', '1002XX3XX4XX5XX'
          FROM hanimacCS.dbo.CC_CHAM AS cham
          INNER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID
          WHERE cham.CHAM_ID = 'id'";

  mH_executeMSSQL(sql);
  //print_r(sql);

  patient = _getPatientMS(date, id);
  //print_r(patient);

  return patient;

}
*/


var _readAllPatientsMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgReadAllRs({"filter":{"date":date}, "col":'daily'}, function(err, rs){
    console.log('readAllPatientsMG', date, rs);
    res.send(rs);
  });
}


var _readAllPatientsMS = function(req, res) {
  var date = req.params.date || '20140723';
  var que = _readPatientsMSQue({"date":date, "type":'all'});
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}


var _readOnePatientMS = function(req, res) {
  var date = req.params.date || '20140723';
  var que = _readPatientsMSQue({"date":date, "CHARTID":req.params.id, "type":'one'});
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}


var _readOnePatientMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgReadOneRs({"filter":{"date":date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
}


var _updatePatientMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgUpdateRs({"body":req.body, "filter":{"date":date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
}


var _deletePatientMG = function(req, res) {
  var date = req.params.date || '20140723';
  mH_utils.mgDeleteRs({"filter":{"date":date, "CHARTID":req.params.id}, "col":'daily'}, function(err, rs){
    res.send(rs);
  });
}

/**
 * 환자 검색(in MSSQL)
 * @caution:
 * @param  {name:'', tel:'', jumin:''}
 * @return json
 */
var _searchPatientsMS = function(req, res) {
  var que = _searchPatientsMSQue({"data":req.body, "type":'search'});

  async.waterfall([
    function(callback) {
      mH_utils.msQueryRs({"que":que}, function(err, rs){
        //res.send(rs);
        callback(err, rs);
        //callback(rs);
      });
    },

    function(rs, callback) {
      async.each(rs, function(r, cb) {  //The second argument (callback) is the "task callback" for a specific r
        r.ITYPE = mH_utils.insuType(r.PART, r.DAE, r.JEUNG); //보험 타입
        r.SEX = mH_utils.calcSex(r.JUMIN);	//성별
      	r.AGE = mH_utils.calcAge(r.JUMIN);  //나이

        _getPatientPhotoMS({"id":r.CHARTID}, function(err, rs2){
          r.PIC = rs2;  //@@@@@@@@#########
          cb(); //잘 모르겠지만 여기 넣으니 되네@@@@@@@@@
        });

      }, function(err) {
        //console.log('foreach rs', rs);
        callback(err, rs);  //each가 완료된 후 callback함수로 err, rs 넘김
      });

    },

  ],

  function(err, results) {
    //console.log(arguments);
    //console.log(results);
    res.send(results);
    //cb(err, results);
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
      mH_utils.msQueryRs({"que":que}, function(err, rs){
        callback(null, rs);
        //console.log('MS Data', rs);
      });
    },

    function(callback) {
      var fields = { CHARTID: 1, KSTATE: 1, LAST: 1, LAST2: 1, BNUM: 1, BTIME: 1, BONBU: 1, TOTAL: 1, BIBO: 1, ORDER1: 1, _id: 0 };
      mH_utils.mgReadFieldsRs({"filter":{"date":date}, "fields":fields, "col":'daily'}, function(err, rs){
        //console.log('_readAllPatientsMG with callback', rs);
        console.log('mongo Data1', rs);
        callback(null, rs);
      });
    }
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    console.log('MS Data', results[0], 'mongo Data', results[1]);
    mH_utils.compareJsonArr({"a":results[0], "b":results[1], "key":"CHARTID"}, function(updated) {

      if (updated.num) {
        //console.log('MSData is updated!!! update event will be triggered!!!', updated);

        //환자 추가
        var added = updated.add;
        if (added.length) {
          //console.log('added array', added);

          for(i in added) {
            //@@@@@@reload시 2번째 reload를 시켜야 추가된 환자가 UI에 적용됨
            //_syncAdd({"id":added[i].CHARTID, "date":date, "res":res}, function(err, rs) {
            _syncAdd({"id":added[i].CHARTID, "date":date}, function(err, rs) {
              //res.send(rs); //@@@@@@@@@@Can't set headers after they are sent.
            });
          }
        }

        //환자 변경
        var upded = updated.upd;
        if (upded.length) {
          console.log('upded array', upded);

          for(i in upded) {
            //@@@@@ 해당 id의 환자 mongodb update
            //_updatePatientMG;
            mH_utils.mgUpdateRs({"body":upded[i], "filter":{"date":date, "CHARTID":upded[i].CHARTID}, "col":'daily'}, function(err, rs) {
            	//console.log('mongodb updated', date, upded[i]);
              //res.send(rs); //@@@@@@@@@@Can't set headers after they are sent.
            });
          }
        }

        //환자 삭제
        var deled = updated.del;
        if (deled.length) {
          //console.log('deled array', deled);

          for(i in deled) {
            //@@@@@ 해당 id의 환자 mongodb delete
            //_deletePatientMG;
            mH_utils.mgDeleteRs({"filter":{"date":date, "CHARTID":deled[i].CHARTID}, "col":'daily'}, function(err, rs){
              //res.send(rs); //@@@@@@@@@@Can't set headers after they are sent.
            });
          }
        }

        res.send(true);
      } else {
        res.send(false);
        //console.log('MSData is not updated!!!');
      }

    });

  });

}




/**
 * saveTimer
 * @caution:
 * @param  string  date      날짜(YYYYmmdd)
 * @param  array   patient    환자 data
 * @return
 */
//var _saveTimer = function(date, id, data) {
var _saveTimer = function(req, res) {
  var date = req.params.date;
  var id = req.params.id;
  //var data = req.params.data;
  var data = req.body;

  type = data['type'];
  intv = data['interval'];

  strTimer = type + ':' + data['timerItem'] + ':' + data['timerIntv'];

  switch (type) {
  case 'ST': //StarT
    //endTime = time() + data['interval'];
    endTime = Math.round(Date.now() / 1000) + data['interval'];
    //strTimer = 'GO:' + _REQUEST['timerItem'] + ':' + endTime;
    strTimer += ':' + endTime;
    break;
  case 'PS': //PauSe
    strTimer += ':' + intv;
    break;
  case 'ED': //EnD
    //strTimer .= 'ED:' + _REQUEST['timerItem'];
    break;
  }
  //}

  mH_utils.mgPatchRs({"body":{"TIMER":strTimer}, "filter":{"date":date, "CHARTID":id}, "col":'daily'}, function(err, rs){
    //console.log();
    res.end();
    //res.send(rs);
  });

}

/**
 * getInterval(종료 남은 시간 반환)
 * @caution:
 * @param  string  date      날짜(YYYYmmdd)
 * @param  array   patient    환자 data
 * @return
 */
var _getInterval = function(req, res) {
//function _getInterval(time) {
  //var date = req.params.date;
  var time = req.params.time;

  //echo time - time();
  //return time - time();
  //return time - Math.round(Date.now() / 1000);
  res.send(time - Math.round(Date.now() / 1000));
}



var _syncAdd = function(opts, cb) {
  var date = opts.date;
  var id = opts.id;
  //var res = opts.res; //@@@@@@@@@@@@@@@@@
  var que = _readPatientsMSQue({"date":date, "id":id, "type":'one'});

  async.waterfall([
    function(callback) {
      mH_utils.OHISNum(id, function(ohis) { //OHIS 구하기 + photo data query
        var que2 = "SELECT CAP_PATH, CAP_WDATE, CAP_REMARK, CAP_BIGO1 FROM OHIS_H.dbo.IM_CAP"
            + ohis
            + " WHERE CAP_CHAM_ID = '"
            + id
            + "' ORDER BY CAP_SEQ DESC";
        //callback(null, que2);
        mH_utils.msQueryRs({"que":que2}, function(err, rs){
          if (!rs) {
            //rs = [{}];
            rs = [];
          };
          callback(err, rs);	//@@@@@@@@@##########
        });
      });
    },
/*
    function(que2, callback) {  //PIC data 구하기
      mH_utils.msQueryRs({"que":que2}, function(err, rs){
        if (!rs) {
          rs = [{}];
        };
        callback(err, rs);
      });
    },
*/
    function(picRs, callback) {  //해당 id 환자정보 구하기
      mH_utils.msQueryRs({"que":que}, function(err, rs){
      	rs[0].SEX = mH_utils.calcSex(rs[0].JUMIN);	//성별
      	rs[0].AGE = mH_utils.calcAge(rs[0].JUMIN);  //나이
        rs[0].PIC = picRs;
        rs[0].date = date;
        //rs[0].SAVED = {"RC":0, "IX":0, "TX":0}; //@@@@@@@@@@@@@@@
        rs[0].SAVEDRC = 0;
        rs[0].SAVEDIX = 0;
        rs[0].SAVEDTX = 0;
        rs[0].CHARTED = {"TOTAL":0,"BIBO":0};
        rs[0].ITYPE = mH_utils.insuType(rs[0].PART, rs[0].DAE, rs[0].JEUNG); //보험 타입
        callback(err, rs[0]);
        rs[0].TIMER = '';
      });
    },

    function(data, callback) {
      mH_utils.mgCreateRs({"body":data, "date":date, "col":'daily'}, function(err, rs){
        callback(err, rs);
      });
    },

  ],

  function(err, results) {
    //console.log(arguments);
    //console.log(results);
    cb(err, results);
  });

}



/**
 * UPDATE patient
 * @caution: !!!date param, sync MSSQL -> mysql / PUT, PATCH
 * @param  string  date
 * @return echo json
 */
var _patchPatientMS = function(opts, cb) {
  var patch = _patchPatientMSQue({date:opts.date, id:opts.id, data:opts.data});
  var que = patch.que;
  var patient = patch.obj;

  //console.log(que);

  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(patient);
  });

  //cb(patient);
  //syncUpdate@@@@@@@@@
}


var _getPatientPhotoMS = function(opts, cb) {
  var id = opts.id;
  mH_utils.OHISNum(id, function(ohis) { //OHIS 구하기 + photo data query
    var que2 = "SELECT CAP_PATH, CAP_WDATE, CAP_REMARK, CAP_BIGO1 FROM OHIS_H.dbo.IM_CAP"
      + ohis
      + " WHERE CAP_CHAM_ID = '"
      + id
      + "' ORDER BY CAP_SEQ DESC";
        //callback(null, que2);
    mH_utils.msQueryRs({"que":que2}, function(err, rs){
      //console.log('_getPatientPhotoMS rs', rs);
      if (!rs || !rs.length) {
        rs = [];
      };
      cb(err, rs);
    });
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

  var arrSelQue1 = [  //sync check용
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
    //"cham.CHAM_SEX AS SEX",
    "cham.CHAM_PASSWORD AS JUMIN", //yy, sex, 외국인 정보, 나이 구할 수 있음!!!
    //"substring(cham.CHAM_PASSWORD, 7, 1) AS jumin02", //yy, sex, 외국인 정보
    //"substring(cham.CHAM_PASSWORD, 1, 6) AS jumin01",  //나이 구할 수 있음
    //"hanimacCS.dbo.UF_getAge3(cham.CHAM_PASSWORD, convert(char(8), Getdate(), 112)) AS AGE",
    //"cham.CHAM_YY AS yy",
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


//환자 검색 query
var _searchPatientsMSQue = function(opts) {
  var name = opts.data.name;
  var tel = opts.data.tel;
  var jumin = opts.data.jumin;

  //console.log('searchPatientsMSQue', opts.data.name);

  //where 구문
  var where = ' WHERE ';
  var arrWhere = [];
  if (name) {
    arrWhere.push(" cham.CHAM_WHANJA LIKE '%" + name + "%' ");
  }
  if (tel) {
    arrWhere.push(" ( cham.CHAM_TEL LIKE '%" + tel+ "%' OR cham.CHAM_HP LIKE '%" + tel+ "') ");
  }
  if (jumin) {
    arrWhere.push(" cham.CHAM_PASSWORD LIKE '%" + jumin + "%' ");
  }
  where += arrWhere.join(' AND ');

  var extra = " FROM hanimacCS.dbo.CC_CHAM AS cham INNER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID ";

  //select fields
  var arrSelQue = [
      "cham.CHAM_ID AS CHARTID",
      "cham.CHAM_JEJU AS JEJUCODE",
      "cham.CHAM_WHANJA AS NAME",
      "cham.CHAM_SEX AS SEX",
      "cham.CHAM_TEL AS TEL",
      "cham.CHAM_HP AS HP",
      //"substring(cham.CHAM_PASSWORD, 1, 6) AS JUMIN",
      "cham.CHAM_PASSWORD AS JUMIN",
      //"hanimacCS.dbo.UF_getAge3(cham.CHAM_PASSWORD, convert(char(8), Getdate(), 112)) AS AGE",
      "cham.CHAM_PART AS PART",
      "cham.CHAM_DAE AS DAE",
      "cham.CHAM_JEUNG AS JEUNG",
      "kwam.KWAM_DATE AS LASTDATE",
      "cham.CHAM_읍면동명 AS ADDRESS"
  ];

  return "SELECT TOP 10 " + arrSelQue.join(', ') + extra + where;
}


//환자 정보 patch(update) query
var _patchPatientMSQue = function(opts) {
  var date = opts.date;
  var id = opts.id;
  var date_ = date.substring(6,8);
  var month = date.substring(0,6);
  var data = opts.data;

  if (data.BNUM) { //베드 설정 및 이동
    //var time_ = new Date().format("hhmmss");
    var time_ = dateFormat(new Date(), "HHMMss");
    //gicho2 = data.BNUM + date("His") + '20';
    gicho2 = data.BNUM + time_ + '20';
    sql = "UPDATE Month.dbo.JUBM" + month +
          " SET JUBM_GICHO1 = '치료베드', JUBM_GICHO2 = '" + gicho2 +
          "' WHERE JUBM_DATE = '" + date_ +
          "' AND JUBM_CHAM_ID = '" + id + "'";
    //return sql;
    data.BTIME = gicho2.substring(2,6);
    data.KSTATE = '치료베드';

    //return sql;
    return {"que":sql, "obj":data};
  } else if (data.KSTATE) { //진료 단계 변경
    state = data.KSTATE;
    sql = "UPDATE Month.dbo.JUBM" + month +
          " SET JUBM_GICHO1 = '" + state +
          "' WHERE JUBM_DATE = '" + date_ +
          "' AND JUBM_CHAM_ID = '" + id + "'";
    //return sql;
    return {"que":sql, "obj":data};
  } else if (data.ORDER1) { //지시사항 변경
    order = data.ORDER1;
    sql = "UPDATE Month.dbo.JUBM" + month +
          " SET JUBM_TODAY = '" + order +
          "' AND JUBM_CHAM_ID = '" + id + "'";
    //return sql;
    return {"que":sql, "obj":data};
  }

}


//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
//exports.createPatients = _createPatientMG;
//exports.createPatient = _createPatientMG;
//exports.createPatient_ = _createPatient;
exports.createPatient = _createPatient;
//exports.readAllPatients = _readAllPatientsMS;
exports.readAllPatients = _readAllPatientsMG;
//exports.readOnePatient = _readOnePatientMS;
exports.readOnePatient = _readOnePatientMG;
exports.updatePatient = _updatePatientMG;

exports.patchPatient = function(req, res) {
  var date = req.params.date;
  var id = req.params.id;
  var data = req.body;

  if (data.BNUM || data.KSTATE || data.ORDER1) {  //MSSQL도 update!!!
    _patchPatientMS({date:date, id:id, data:data}, function(rs){
      //console.log('_patchPatientMS', rs);
      res.send(rs);
      //mongodb update(patch)
    });
  } else {  //mongodb만 update
    mH_utils.mgPatchRs({"body":data, "filter":{"date":date, "CHARTID":id}, "col":'daily'}, function(err, rs){
      //console.log();
      res.end();
      //res.send(rs);
    });
  }

/*
  //arrPatient = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));
  //echo json_encode(arrPatient);

  //MSSQL update: 치료 상태 변경, 베드 배정시 분기,  / 진료비, 최종내원일은 추후 사용여부 결정(수납기능) / 사진 추가는 별도
  //베드 배정
  if (isset(arrPatient['BNUM'])) { //치료베드
    echo json_encode(_updatePatientMS(date, arrPatient));
  } else if (isset(arrPatient['KSTATE'])) {  //진료단계
    echo json_encode(_updatePatientMS(date, arrPatient));
  } else if (isset(arrPatient['ORDER1'])) {  //지시사항
    _updatePatientMS(date, arrPatient);
    echo json_encode(_updPatientMY(date, arrPatient));
  } else if (isset(arrPatient['SAVEDRC']) || isset(arrPatient['SAVEDIX']) || isset(arrPatient['SAVEDTX'])) { //chart 저장 상태
    echo json_encode(_updPatientMY(date, arrPatient));
  }

  sql = "UPDATE `patient_date` SET " . mH_getUpdStr(arrPatient) . " WHERE CHARTID = 'id'";
  mH_executeMYSQL(sql);
*/
}




exports.deletePatient = _deletePatientMG;

//exports.fetch = _getPatientsSyncMS;
exports.syncPatientsMSMG = _syncPatientsMSMG;
exports.searchPatients = _searchPatientsMS;

exports.saveTimer = _saveTimer;
exports.getInterval = _getInterval;




/*

function searchPatientMS() {
  //_REQUEST[]
  where = 'WHERE ';
  andWhere = '';
  //arrWhere = array();
  name = _REQUEST['name'];
  tel = _REQUEST['tel'];
  jumin = _REQUEST['jumin'];
  //print_r(_REQUEST['name']);

  if (name) {
      arrWhere['name'] = " cham.CHAM_WHANJA LIKE '%name%' ";
  }

  if (tel) {
      arrWhere['tel'] = " ( cham.CHAM_TEL LIKE '%tel' OR cham.CHAM_HP LIKE '%tel') ";
  }

  if (jumin) {
      arrWhere['jumin'] = " cham.CHAM_PASSWORD LIKE '%jumin%' ";
  }

  where = ' WHERE ' . implode(' AND ', arrWhere);
  //print_r(where . "\n<br>");

  sql = "SELECT TOP 10
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
      . where .
      " ORDER BY kwam.KWAM_DATE DESC";
  //echo sql;
  //echo json_encode(mH_selectArrayMSSQL(sql));
  rs =  mH_selectArrayMSSQL(sql);

  foreach(rs as &val) {
    //print_r('id:' . val['CHARTID']);
    val['PIC'] = json_encode(_getPatientPhotoMS(val['CHARTID']));
    //arrType = explode('|', val['TYPE']);
    val['ITYPE'] = mH_InsuType(val['PART'], val['DAE'], val['JEUNG']);
    //val['age'] = _getPatientAge(yy, jumin01);
    //val['itype'] = _getPatientIType(insPart, insDae, insJeung);
  }

  echo json_encode(rs);
}
*/

////TEST: ASYNC PARALLEL