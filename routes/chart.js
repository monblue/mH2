//=============================================================================
// REQUIRE
//=============================================================================
var mH_utils = require('../mH_utils');
var async = require('async');
var dateFormat = require('dateformat');

//=============================================================================
// FUNCTIONS
//=============================================================================
//-----------------------------------------------------------------------------
// ChartRc
//-----------------------------------------------------------------------------
//// CRUD
/**
* @function: create[insert or upadate] Rc(진료기록, 신상기록, 특이사항)
* @caution: trim은 client side에서 해결하는 것을 원칙으로 하나, null data는 저장하지 않도록 스크린...
*/
exports.createChartRc = function(req, res) {

  //var rc = req.body.items;
  var data = req.body.attached;
  var ohis = mH_utils.OHIS(req.params.id);

  opts = {
    "id":req.params.id,
    "date":req.params.cur_date,
    "ohis":ohis,
    "data":data  //@@@@@@@@@@@
  };

  var RcTx = mH_utils.trim(req.body.items.OSSC_PF);  //'RcTx' 진료기록
  var RcJm = mH_utils.trim(req.body.items.JINMEMO_MEMO);  //'RcJm' 신상기록
  var RcRm = mH_utils.trim(req.body.items.REMK_REMARK);  //'RcRm' 특이사항

  async.parallel([
    function(callback) {  //'RcTx' 진료기록
      //var RcTx = mH_utils.trim(rc.RcTx);
			if (!RcTx || RcTx == '') {
      	callback(null, '진료기록 내용 없음');
      } else {
	      var opts1 = JSON.parse(JSON.stringify(opts));  //객체 복제(object clone)
	      opts1.type = 'RcTx';
	      opts1.rc = RcTx;
	      _createRcPr(opts1, callback);
      }
    },
    function(callback) {  //'RcJm' 신상기록
      //var RcJm = mH_utils.trim(rc.RcJm);
			if (!RcJm || RcJm == '') {
      	callback(null, '진료기록 내용 없음');
      } else {
	      var opts2 = JSON.parse(JSON.stringify(opts));  //객체 복제(object clone)
	      opts2.type = 'RcJm';
	      opts2.rc = RcJm;
	      _createRcPr(opts2, callback);
      }
/*
      var opts2 = JSON.parse(JSON.stringify(opts));
      opts2.type = 'RcJm';
      //opts.rc = mH_utils.trim(req.body.RcTx);  //trim@@@@@@
      opts2.rc = rc.RcJm;  //trim@@@@@@ 테스트용
      _createRcPr(opts2, callback);
*/
    },
    function(callback) {  //'RcRm' 특이사항
      //var RcRm = mH_utils.trim(rc.RcJmRm);
			if (!RcRm || RcRm == '') {
      	callback(null, '진료기록 내용 없음');
      } else {
	      var opts3 = JSON.parse(JSON.stringify(opts));  //객체 복제(object clone)
	      opts3.type = 'RcRm';
	      opts3.rc = RcRm;
	      _createRcPr(opts3, callback);
      }
/*
      var opts3 = JSON.parse(JSON.stringify(opts));
      opts3.type = 'RcRm';
      //opts.rc = mH_utils.trim(req.body.RcTx);  //trim@@@@@@
      opts3.rc = rc.RcRm;  //trim@@@@@@ 테스트용
      _createRcPr(opts3, callback);
*/
    }
  ],

  //callback
  function(err, results) {  //response send 변경예정@@@@, error, success
    var rs2 = {};
    //console.log(results[0], results[1], results[2]);
    rs2['OSSC_PF'] = results[0];
    rs2['JINMEMO_MEMO'] = results[1];
    rs2['REMK_REMARK'] = results[2];
    res.send(rs2);  //response
  });
}


/**
* @function: read Rc(진료기록, 신상기록, 특이사항)
* @caution:
*/
exports.readChartRc = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  //var opts = {"id":req.params.id, "date":req.params.ref_date, "ohis":ohis, "type":"Rc"};
  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"Rc"};
  _isDone(opts, function(err, rs) {
    //if (rs || rs.length) {  //Rc가 입력되어있는 경우 현재 날짜 데이터 가져옴@@@
    if (!rs || !rs.length) {  //Rc가 입력되지 않은 경우 ref_date 날짜 데이터 가져옴@@@@@
      opts.date = req.params.ref_date;
    }

    async.parallel([	//async functions
      function(callback) {	//진료기록
      	opts.type = 'RcTx';
        _readRcPr(opts, callback);
      },

      function(callback) {	//신상기록
        opts.type = 'RcJm';
        _readRcPr(opts, callback);
      },

      function(callback) {  //특이사항
        opts.type = 'RcRm';
        _readRcPr(opts, callback);
      },
    ],

    function(err, results) {	//callback
      var rs2 = {};
      rs2['OSSC_PF'] = mH_utils.trim(results[0][0].OSSC_PF);	//@@@@@@@@에러 생기는 경우 있음... node server down 현상은 어떻게....@@@@@@@@@@@@@
      rs2['JINMEMO_MEMO'] = mH_utils.trim(results[1][0].JINMEMO_MEMO);
      rs2['REMK_REMARK'] = mH_utils.trim(results[2][0].REMK_REMARK);
      res.send(rs2);  //response
    });
  });

}


/**
* @function:
* @caution: NOT USED YET
*/
var _updateChartRc = function(req, res) {

}


/**
* @function:
* @caution: NOT USED YET
*/
var _deleteChartRc = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _readChartOsscs = function(req, res) {
  var id = req.params.id;
  var ohis = mH_utils.OHIS(req.params.id);
  var n = req.params.n || 10; //보여주는 개수@@@@@@@@@
  var que = "SELECT TOP " + n +
    " OSSC_DATE AS OSSC_DATE, CAST(OSSC_PF AS text) AS OSSC_PF" +
    " FROM OHIS_H.dbo.OSSC" + opts.ohis +
    " WHERE OSSC_CHAM_ID = '" + opts.id +
    "' ORDER BY OSSC_DATE DESC"

  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}

//-----------------------------------------------------------------------------
// ChartIx
//-----------------------------------------------------------------------------

/**
* @function:
* @caution:
*/
exports.readChartIxs = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  var id = req.params.id;
  var date = req.params.ref_date;
  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"Ix"};
  _isDone(opts, function(err, rs) {
    //if (rs || rs.length) {  //Ix가 입력되어있는 경우 현재 날짜 데이터 가져옴@@@
    if (!rs || !rs.length) {  //Ix가 입력되지 않은 경우 ref_date 날짜 데이터 가져옴@@@@@
      opts.date = req.params.ref_date;
    }

  	var month = opts.date.substr(0, 6);
  	var date_ = opts.date.substr(6, 2);

  	que = "SELECT odis.ODIS_SEQ as seq, odis.ODIS_BIGO1 as ODSC_BIGO1, odis.ODIS_DISM_ID as ODSC_DISM_ID, " +
  		"(case when odis.ODIS_BIGO1 != ''" +
      " then (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_KEY = odis.ODIS_BIGO1 )" +
      " else (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_ID = odis.ODIS_DISM_ID )" +
      " end) as ixName" +
      " FROM Month.dbo.ODIS" + month + " as odis" +
      " WHERE odis.ODIS_CHAM_ID = '" + id + "' AND  odis.ODIS_DATE = '" + date_ +
      "' ORDER BY odis.ODIS_SEQ";

	  mH_utils.msQueryRs({"que":que}, function(err, rs){
	    res.send(rs);
	  });
  });
}

/**
* @function:
* @caution:
*/
var _readChartIx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _createChartIxs = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  var id = req.params.id;
  var date = req.params.cur_date;
  var ixItems = req.body.items; //@@@@@@@@@@
  var data = req.body.attached; //@@@@@@@@@@

  var que = ''; //@@@@@@@@@@@
  var que1 = ''; //@@@@@@@@@@@

  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"sunab"};
  _isDone(opts, function(err, rs) {
    //if (rs || rs.length) {  //Rc가 입력되어있는 경우 현재 날짜 데이터 가져옴@@@
    if (rs && rs.length) {  //이미 수납처리된 데이터가 있는 경우 처리@@@
      //res.send('{"res":"D"}');  //@@@@@@@@@@@@@@@@@@@@
      //console.log('{"res":"D"}');
      return;
    } else {
      var month = opts.date.substr(0, 6);
      var date_ = opts.date.substr(6, 2);
    }

    var opts1 = JSON.parse(JSON.stringify(opts));

    opts1.type = 'Ix';

    _isDone(opts1, function(err, rs){
      que1 = '';
      if (rs && rs.length) {  //이미 입력된 데이터가 있는 경우 처리@@@
        que1 = "DELETE Month.dbo.ODIS" + month +
               " WHERE ODIS_CHAM_ID = '" + id +
               "' AND ODIS_DATE = '" + date_ + "'" + "\n";
      }
      ////@@@@@@@@@@@@@@@@@@@@@@@@@@@
      seq = 0;
      len = ixItems.length;

      for (i=0; i<len; i++) {
        seq++;
        main = (seq == 1) ? '주' : '';
        ODIS_DISM_ID = ixItems[i]['ODSC_DISM_ID'];
        ODIS_BIGO1 = ixItems[i]['ODSC_BIGO1'];

        ins = {
          "ODIS_DATE":date_,
          "ODIS_CHAM_ID":id,
          "ODIS_DISM_ID":ODIS_DISM_ID,
          "ODIS_SEQ":seq,
          "ODIS_BIGO":main,
          "ODIS_BIGO1":ODIS_BIGO1,
          "ODIS_MEDM_ID":data['MEDM'],
          "ODIS_GWAM_ID":data['GWAM'],
          "ODIS_DISM_ID1":'',    //?
          "ODIS_GWAM_ID1":'',    //?
          "ODIS_VCODE":'',       //희귀 난치성?
          "ODIS_SANG":''         //?
        }

        que1 += "INSERT INTO Month.dbo.ODIS" + month + mH_utils.insStr(ins) + "\n";
      }

      mH_utils.msQueryRs({"que":que1}, function(err, rs){
        res.send(rs);
      });

    });
  });

}

/**
* @function:
* @caution: NOT USED
*/
var _createChartIx = function(req, res) {

}

/**
* @function:
* @caution: NOT USED
*/
var _updateChartIxs = function(req, res) {

}

/**
* @function:
* @caution: NOT USED
*/
var _updateChartIx = function(req, res) {

}

/**
* @function:
* @caution: NOT USED
*/
var _updateChartIxs = function(req, res) {

}

/**
* @function:
* @caution: NOT USED
*/
var _updateChartIx = function(req, res) {

}

/**
* @function:
* @caution: NOT USED or modify parameters
*/
var _deleteChartIxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _deleteChartIx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _searchIx = function(req, res) {
  //$term = str_replace('.', '', $term);    //#### '.' 없앰, check항목 더 만들어야...
  //var term = req.body.term;  //@@@ replace
  var term = req.params.term;  //@@@ replace
  var n = req.params.n || 20;
  var strWhere = " WHERE DISM_NP != 'N'";
  var arrTerm = term.split(' ');  //@@@ ' ': AND, @@',': OR@@@@@@@@@

  for(i in arrTerm) {
    strWhere += " AND DISM_HNAME LIKE '%" + arrTerm[i] + "%'";
  }

  que = "SELECT TOP " + n +
        " DISM_HNAME as name, DISM_KEY as key1, DISM_ID as code" +
        " FROM hanimacCS.dbo.CC_DISM_2011" + strWhere +
        " ORDER BY DISM_HNAME";

  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}

/**
* @function:
* @caution:
*/
var _getPrmIxs = function(req, res) {
  var term = req.params.term || '';  //@@@ replace, trim

  var strWhere = " FROM hanimacCS.dbo.PROMISE50 WHERE CLS = '상병명' ";
  if (term != '') {
    strWhere += " AND Title LIKE '%" + term + "%'";
  }
  strWhere += " ORDER BY Title";

  sel = [
    "rtrim(Title) AS Title",
    "rtrim(CodeName) AS NAME",
    "rtrim(Code) AS DISM_ID",
    "rtrim(CodeExp) AS DISM_KEY"
  ];

  que = "SELECT " + sel.join(', ') + strWhere;
  //console.log(que);

  mH_utils.msQueryRs({"que":que}, function(err, rs){
  	console.log(rs);
    res.send(rs);
  });

}

//-----------------------------------------------------------------------------
// ChartTx
//-----------------------------------------------------------------------------
/**
* @function:
* @caution:
*/
var _getPrmTxs = function(req, res) {
  var term = req.params.term || '';  //@@@ replace, trim

  var strWhere = " FROM hanimacCS.dbo.PROMISE50 WHERE CLS != '상병명' ";
  if (term != '') {
    strWhere += " AND Title LIKE '%" + term + "%'";
  }
  strWhere += " ORDER BY Title";

  sel = [
    "rtrim(Title) AS Title",
    "rtrim(CLS) AS CLS",
    "rtrim(CodeName) AS CodeName",
    "rtrim(Code) AS Code",
    "rtrim(CodeExp) AS CodeExp",
    "rtrim(CodeExp1) AS CodeExp1",
    "rtrim(CodeExp2) AS CodeExp2"
  ];

  que = "SELECT " + sel.join(', ') + strWhere;

  mH_utils.msQueryRs({"que":que}, function(err, rs){
  	console.log(rs);
    res.send(rs);
  });

}

/**
* @function:
* @caution:
*/
exports.readChartTxs = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  var id = req.params.id;
  var date = req.params.ref_date;
  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"Tx"};
  _isDone(opts, function(err, rs) {
    //if (rs || rs.length) {  //Tx가 입력되어있는 경우 현재 날짜 데이터 가져옴@@@
    if (!rs || !rs.length) {  //Tx가 입력되지 않은 경우 ref_date 날짜 데이터 가져옴@@@@@
      //opts.date = req.params.ref_date;
      date = req.params.ref_date;
    }

  	que = "SELECT OPSC_MOMM_ID, OPSC_ORDER, OPSC_BIGO2, OPSC_BLOD, OPSC_BIGO5, OPSC_AMT, OPSC_DAY" +
  		" FROM OHIS_H.dbo.OPSC" + ohis +
      " WHERE OPSC_CHAM_ID = '" + id + "' AND OPSC_DATE = '" + date +
      "' AND substring(OPSC_MOMM_ID, 1, 2) != '10' AND OPSC_TOTAL < 2 AND OPSC_BIGUB = '0'" +
      " ORDER BY OPSC_SEQ";

    console.log(que);

	  mH_utils.msQueryRs({"que":que}, function(err, rs){
      console.log(rs);
	    res.send(rs);
	  });
  });
}

/**
* @function:
* @caution:
*/
var _readChartTx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _createChartTxs = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  var id = req.params.id;
  var date = req.params.cur_date;
  var txItems = req.body.items; //@@@@@@@@@
  var data = req.body.attached; //@@@@@@@@@

  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"sunab"};
  _isDone(opts, function(err, rs) {
    if (rs && rs.length) {  //이미 수납처리된 데이터가 있는 경우 처리@@@
      res.send('{"res":"D"}');
    } else {
      //var month = opts.date.substr(0, 6);
      //var date_ = opts.date.substr(6, 2);
    }

    var month = opts.date.substr(0, 6);
    var date_ = opts.date.substr(6, 2);
    //console.log('date', opts.date);


    var opts1 = JSON.parse(JSON.stringify(opts));
    opts1.type = "Tx";
    _isDone(opts1, function(err, rs){
      var sqlOENT = '';
      var sqlOPSC = '';
      if (rs || rs.length) {  //이미 입력된 데이터가 있는 경우 처리@@@
        sqlOENT = "DELETE Month.dbo.OENT" + month +
               " WHERE OENT_CHAM_ID = '" + id +
               "' AND OENT_DATE = '" + date_ + "'" + "\n";
        sqlOPSC = "DELETE OHIS_H.dbo.OPSC" + ohis +
               " WHERE OPSC_CHAM_ID = '" + id +
               "' AND OPSC_DATE = '" + date + "'" + "\n";
      }

      var len = txItems.length;
      for (i = 0; i < len; ++i) {
        seq = i + 1;
        mommId = txItems[i]['OPSC_MOMM_ID'];
        momrId = mommId;  //없애도 되는지 테스트@@@@@@@@@
        gubun = 0;
        bigo2 = txItems[i]['OPSC_BIGO2'];
        blod = txItems[i]['OPSC_BLOD'];    //'자락'이 입력되는 에러 테스트용
        //blod = '';    //'자락'이 입력되는 에러 테스트용
        //bigo5 = str_replace(' ', '', txItems[i]['OPSC_BIGO5']);    //자락이 뜨는 에러 해결@@@@@@@@@@
        bigo5 = txItems[i]['OPSC_BIGO5'].replace(' ', '');    //자락이 뜨는 에러 해결@@@@@@@@@@
        name = txItems[i]['OPSC_ORDER'];   //보험약의 경우 OPSC_ORDER가 없으면 달력에 'EX'표시 되지 않음!!!@@@
        amt = 1;
        day = 1;
        bibo = 0;

        //@@@보험약, group외 다른 확인방법??
        if (txItems[i]['group'] == '15' || txItems[i]['group'] == '15_1') {
            amt = txItems[i]['OPSC_AMT'];
            day = txItems[i]['OPSC_DAY'];

            if (mommId.substr(1, 1) == 'C' || momrId.substr(1, 1) == 'G') {
                gubun = 6;
                momrId = str_replace('`', '', mommId);  //없애도 되는지 테스트@@@@@@@@@
            } else {
                gubun = 5;
            }
        }

        //@@@비보험, group외 다른 확인방법??
        if (txItems[i]['group'] > 50) {
            //bibo = txItems[i]['price'];
            bibo = '1';    //OENT_BIGUB: 1
        }

        arrOENT = {
          "OENT_MEDM_ID":data['MEDM'],
          "OENT_DATE":date_,
          "OENT_CHAM_ID":id,
          "OENT_GWAM_ID":data['GWAM'],
          "OENT_CNT":seq,
          //"OENT_RNO":'',
          //"OENT_NO":'',
          "OENT_MOMR_ID":momrId,
          "OENT_MOMM_ID":mommId,
          "OENT_BLOD":blod,
          //"OENT_DANGA":'',
          "OENT_AMT":amt,
          "OENT_ONE_AMT":'1',
          "OENT_DAY":day,
          //"OENT_USGM_ID":'',
          //"OENT_INOUT":'0',
          //"OENT_EX_CODE":'',
          "OENT_BIGUB":bibo,
          "OENT_GASAN1":'0', //0이 아닌 경우 확인요@@@@@
          "OENT_GASAN2":'0', //0이 아닌 경우 확인요@@@@@
          //"OENT_DEPT_ID":'',
          //"OENT_GRP_NAME":'',
          "OENT_GUBUN":gubun,   //0이 아닌 경우 확인요@@@@@
          //"OENT_SUGI":'0',
          //"OENT_TOTAL":'0',
          //"OENT_SUP_ID":'',
          //"OENT_SUP_NAME":'',
          "OENT_TRANS_NO":'0',   //필수!!! 0이 아닌 경우 확인요@@@@@
          "OENT_DOC_ID":data['LDOC'],
          //"OENT_HCODE":'',
          //"OENT_BIGO1":'',
          "OENT_BIGO2":data['MEDM'], // OENT_MEDM_ID와 항상 같은지 확인요
          "OENT_BIGO3":bigo2,   //OPSC에서는 BIBO2!!!!!
          //"OENT_LICENSE":'20289',
          //"OENT_NAME":'문정삼'
        };

        //비보험 단가(보험 단가가 자동으로 계산된다면 그냥 넣어도 됨@@@@@@@@)
        if (txItems[i]['group'] > 50) {
          arrOENT['OENT_DANGA'] = txItems[i]['price'];
        }

        arrOPSC = {
          "OPSC_MEDM_ID":data['MEDM'],
          "OPSC_CHAM_ID":id,
          "OPSC_GWAM_ID":data['GWAM'],
          "OPSC_DATE":date,
          "OPSC_SEQ":seq,
          //"OPSC_RNO":'1',
          "OPSC_BLOD":blod,
          "OPSC_ORDER":name,    //보험약의 경우 OPSC_ORDER가 없으면 달력에 'EX'표시 되지 않음!!!
          "OPSC_MOMR_ID":momrId,
          "OPSC_MOMM_ID":mommId,
          //"OPSC_DANGA":'6960',
          "OPSC_AMT":amt,
          "OPSC_ONE_AMT":'1',
          "OPSC_DAY":day,
          //"OPSC_USG":'',
          //"OPSC_INOUT":'0',
          //"OPSC_EX_CODE":'',
          "OPSC_BIGUB":bibo,
          "OPSC_GASAN1":'0',
          "OPSC_GASAN2":'0',
          //"OPSC_HANG":'1',
          //"OPSC_MOK":'2',
          //"OPSC_HEANG":'0',
          //"OPSC_DEPT_ID":'',
          //"OPSC_LINK_CODE":'',
          //"OPSC_GRP_NAME":'',
          "OPSC_GUBUN":gubun,
          "OPSC_TOTAL":'0',
          //"OPSC_SUP_ID":'',
          //"OPSC_SUP_NAME":'',
          "OPSC_TRANS_NO":'0',
          //"OPSC_HCODE":'',
          //"OPSC_ACTING":'',
          //"OPSC_FDOC_ID":data['FDOC'],
          //"OPSC_LDOC_ID":data['LDOC'],
          //"OPSC_CHEOPSU":'',
          //"OPSC_PACK_NUMBER":'',
          //"OPSC_ILBUN":'',
          //"OPSC_DESC":'',
          //"OPSC_HPACK_MEMO":'',
          //"OPSC_BIGO1":'',
          "OPSC_BIGO2":bigo2,
          //"OPSC_BIGO3":'',
          //"OPSC_BIGO4":'',
          "OPSC_BIGO5":bigo5,
          //"OPSC_BIGO6":null,
          //"OPSC_BIGO7":null,
          //'OPSC_BIGO8'=>NULL
        };

        if (txItems[i]['group'] > 50) {   //비보험 단가(보험 단가가 자동으로 계산된다면 그냥 넣어도 됨@@@@@@@@)
            arrOPSC['OPSC_DANGA'] = txItems[i]['price'];
        }

        //print_r(dataOENT);
        //print_r(dataOPSC);

        sqlOENT += "INSERT INTO Month.dbo.OENT" + month + " " + mH_utils.insStr(arrOENT) + "\n";

        sqlOPSC += "INSERT INTO OHIS_H.dbo.OPSC" + ohis + " " + mH_utils.insStr(arrOPSC) + "\n";

      }
      //console.log(sqlOENT);
      //console.log("\n\n");
      //console.log(sqlOPSC);
      que = sqlOENT + sqlOPSC;
      //console.log(que);

      mH_utils.msQueryRs({"que":que}, function(err, rs){
        res.send(rs);
      });

    });
  });

}

/**
* @function:
* @caution:
*/
var _createChartTx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartTxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartTx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartTxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartTx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _deleteChartTxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _deleteChartTx = function(req, res) {

}


/**
* @function:
* @caution: //@@@@@@@ getAcuCodes 와 비교@@@@@@@@@@@@@
*/
exports.searchAcu = function(req, res) {
  var term = req.params.term.replace(' ', '');  //@@@ replace
  var arrName = term.split('/');
  //var arrName = term.split('a');
  var data = {
    "PX1":[],
    "PX2":[]
  };

  async.each(arrName, function(name, callback) {
    que = "SELECT BLOD_ID AS code, BLOD_HNAME AS name" +
          " FROM hanimacCS.dbo.H_BLOD WHERE BLOD_HNAME  LIKE '" +
          name + "%'";
    //console.log(que);

    mH_utils.msQueryRs({"que":que}, function(err, rs){
      if (!rs || !rs.length) {
        //console.log('해당 경혈명 없음');
      } else if (rs.length == 1) {
        //console.log("data['PX1'].push", rs[0]);
        data['PX1'].push(rs[0]);
      } else if (rs.length > 1) {
        for (j in rs) {
          //console.log("data['PX2'].push", rs[j]);
          data['PX2'].push(rs[j]);
        }
      }
      //callback(null, data);
      callback();
    });

  }, function(err) {  //callback
    //console.log('loop is ended');
    res.send(data);
  });

}

/**
* @function:
* @caution:
*/
var _getMommDataMY = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getMommDataMS = function(req, res) {
    //SELECT  MOMM_ID, MOMM_HNAME, MOMM_HANG, MOMM_MOK, MOMM_GUBUN, MOMM_BIGUB, MOMM_ROUND, MOMM_HYANG, MOMM_M1_SUGA, MOMM_M1_DATE, MOMM_DISK_GUBUN, MOMM_BIGO1, MOMM_BIGO2
    //FROM hanimacCS.dbo.CC_MOMM
    //WHERE (len(MOMM_ID) = 5 or (len(MOMM_ID) = 8 AND substring(MOMM_ID, 6,2) = '00')) AND isnumeric(substring(MOMM_ID, 1, 1)) > 0  AND MOMM_M1_SUGA > 0 AND MOMM_BIGUB = 0 AND (MOMM_HNAME not like '%병원%' AND MOMM_HNAME not like '%한방과%' AND MOMM_HNAME not like '%-의원%' AND MOMM_HNAME not like '%식%')

  que = "SELECT MOMM_HNAME AS name, MOMM_M1_SUGA AS price" +
        " FROM hanimacCS.dbo.CC_MOMM" +
        " WHERE MOMM_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    res.send(rs);
  });
}

/**
* @function: 약속 경혈(한글 경혈명 추가!!)
* @caution: //SELECT BLOD_HNAME FROM hanimacCS.dbo.H_BLOD WHERE BLOD_ID = 'LI002'
*/
//http://192.168.0.11:3333/getPrmAcus
exports.getPrmAcus = function(req, res) { //이중 async.each
  var que = "SELECT ASK_ID AS ASK_ID, ASK_NAME AS ASK_NAME" +
        " FROM hanimacCS.dbo.CC_ASK" +
        " WHERE ASK_BIGO LIKE '약속경혈%' ORDER BY ASK_SEQ";

  mH_utils.msQueryRs({"que":que}, function(err, results){
    async.each(results, function(result, callback) {
      result['BLOD_HNAME'] = '';
      arrAcuId = result['ASK_NAME'].split('/');

      async.each(arrAcuId, function(acuId, callback2) {
        _getAcuHname(acuId, function(err, rs1){
          if (rs1 && rs1.length) {
            result['BLOD_HNAME'] += rs1[0]['BLOD_HNAME'] + '/';
          }
          callback2();
        });
      }, function(err) {
        callback();
      });

    }, function(err) {  //callback
      res.send(results);
    });
  });

}

/**
* @function: 한글 경혈명 얻기
* @caution:
*/
function _getAcuHname(id, cb) {
  var que = "SELECT BLOD_HNAME AS BLOD_HNAME" +
        " FROM hanimacCS.dbo.H_BLOD" +
        " WHERE BLOD_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
}


/**
* @function: 입력 추가 경혈 (혈명, 코드) 반환
* @caution: @@@@@@@@@@@@@ _searchAcu와 비교할 것 @@@@@@@@@@@@
*/
var _getAcuCodes = function(req, res) {
  var term = req.body.term.replace(' ', '');  //@@@ replace
  var arrName = term.split('/');
  //var arrName = term.split('a');
  var data = {
    "Acu1":[],
    "Acu2":[]
  };

  async.each(arrName, function(name, callback) {
    que = "SELECT BLOD_ID AS code, BLOD_HNAME AS name" +
          " FROM hanimacCS.dbo.H_BLOD WHERE BLOD_HNAME  LIKE '" +
          name + "%'";
    //console.log(que);

    mH_utils.msQueryRs({"que":que}, function(err, rs){
      if (!rs || !rs.length) {
        //console.log('해당 경혈명 없음');
      } else if (rs.length == 1) {
        //console.log("data['PX1'].push", rs[0]);
        data['Acu1'].push(rs[0]);
      } else if (rs.length > 1) {
        for (j in rs) {
          //console.log("data['PX2'].push", rs[j]);
          data['Acu2'].push(rs[j]);
        }
      }
      //callback(null, data);
      callback();
    });

  }, function(err) {  //callback
    //console.log('loop is ended');
    res.send(data);
  });
}

/**
* @function:
* @caution:
*/
var _getPrmGroups = function(req, res) {

}

//-----------------------------------------------------------------------------
// FUNCTIONS
//-----------------------------------------------------------------------------
/**
* @function: for createChartRc
* @caution:
*/
function _createRcPr(opts, callback) {
  var que = _checkRcMSQue(opts);

  mH_utils.msQueryRs({"que":que}, function(err, rs) {
  	console.log('check que, rs', rs);
    if (!rs || !rs.length) {
      var que1 = _createRcMSQue(opts);
    } else {
      var que1 = _updateRcMSQue(opts);
    }

    mH_utils.msQueryRs({"que":que1}, function(err, rs1){
    	console.log('check que1, rs1', opts, que1, rs1);
      callback(err, que1);
      //callback(err, rs);
    });

  });
}

/**
* @function: for createChartRc / _createRcPr
* @caution:
*/
function _checkRcMSQue(opts) {
  switch(opts.type) {
  case 'RcTx':
    que = "SELECT OSSC_CHAM_ID FROM OHIS_H.dbo.OSSC" + opts.ohis +
          " WHERE OSSC_CHAM_ID = '" + opts.id +
          "' AND OSSC_DATE = '" + opts.date + "'";
    break;
  case 'RcJm':
    que = "SELECT JINMEMO_CHAM_ID FROM hanimacCS.dbo.CC_JINMEMO" +
          " WHERE JINMEMO_CHAM_ID = '" + opts.id + "'";
    break;
  case 'RcRm':
    que = "SELECT REMK_CHAM_ID FROM hanimacCS.dbo.CC_REMK" +
          " WHERE REMK_CHAM_ID = '" + opts.id + "'";
    break;
  }

  return que;
}

/**
* @function: for createChartRc / _createRcPr
* @caution:
*/
function _createRcMSQue(opts) {
  //var type = opts.type;
  var id = opts.id;
  var date = opts.date;
  //var ohis = opts.ohis;
  var rc = opts.rc;  //rc: RcTx, RcJm, RcRm
  var data = opts.data;

  switch(opts.type) {
  case 'RcTx':
    pre = "INSERT INTO OHIS_H.dbo.OSSC" + opts.ohis + " ";
    ins = {
      "OSSC_MEDM_ID":data['MEDM'],
      "OSSC_CHAM_ID":id,
      "OSSC_GWAM_ID":data['GWAM'],
      "OSSC_DATE":date,
      "OSSC_PF":rc,
      "OSSC_FDOC_ID":data['FDOC'],
      "OSSC_LDOC_ID":data['LDOC']
    };
    //extra = ""
    break;
  case 'RcJm':
    pre = "INSERT INTO hanimacCS.dbo.CC_JINMEMO "
    ins = {
      "JINMEMO_CHAM_ID":id,
      "JINMEMO_GWAM_ID":data['GWAM'],
      "JINMEMO_DATE":date,
      "JINMEMO_MEMO":rc,
      "JINMEMO_USRM_ID":data['FDOC']  //FDOC, LDOC, USRM
    };
    //extra = ""
    break;
  case 'RcRm':
    pre = "INSERT INTO hanimacCS.dbo.CC_REMK "
    ins = {
      "REMK_CHAM_ID":id,
      "REMK_REMARK":rc,
      "REMK_DOC_ID":data['FDOC']  //FDOC, LDOC, USRM
    };
    //extra = ""
    break;
  }

  return pre + mH_utils.insStr(ins);

}

/**
* @function: for createChartRc / _createRcPr
* @caution:
*/
function _updateRcMSQue(opts) {
  //var type = opts.type;
  //var id = opts.id;
  //var date = opts.date;
  //var ohis = opts.ohis;
  var rc = opts.rc;  //rc: RcTx, RcJm, RcRm

  switch(opts.type) {
  case 'RcTx':
    que = "UPDATE OHIS_H.dbo.OSSC" + opts.ohis +
          " SET OSSC_PF = '" + rc +
          "' WHERE OSSC_CHAM_ID = '" + opts.id +
          "' AND OSSC_DATE = '" + opts.date + "'";
    break;
  case 'RcJm':
    que = "UPDATE hanimacCS.dbo.CC_JINMEMO SET JINMEMO_MEMO = '" +
          rc + "', JINMEMO_DATE = '" + opts.date +
          "' WHERE JINMEMO_CHAM_ID = '" + opts.id + "'";
    break;
  case 'RcRm':
    que = "UPDATE hanimacCS.dbo.CC_REMK SET REMK_REMARK = '" +
          rc + "' WHERE REMK_CHAM_ID = '" + opts.id + "'";
    break;
  }

  return que;
}


/**
* @function: for readChartRc
* @caution:
*/
function _readRcPr(opts, callback) {
  mH_utils.msQueryRs({"que":_readRcMSQue(opts)}, function(err, rs){
    callback(err, rs);
  });
}

/**
* @function: for readChartRc / _readRcPr
* @caution:
*/
function _readRcMSQue(opts) {
  switch(opts.type) {
  case 'RcTx':
    que = "SELECT CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC" + opts.ohis +
          " WHERE OSSC_CHAM_ID = '" + opts.id +
          "' AND OSSC_DATE = '" + opts.date + "'";
    break;
  case 'RcJm':
    que = "SELECT CAST(JINMEMO_MEMO AS text) AS JINMEMO_MEMO" +
    			" FROM hanimacCS.dbo.CC_JINMEMO" +
          " WHERE JINMEMO_CHAM_ID = '" + opts.id + "'";
    break;
  case 'RcRm':
    que = "SELECT  CAST(REMK_REMARK AS text) AS REMK_REMARK" +
    			" FROM hanimacCS.dbo.CC_REMK" +
          " WHERE REMK_CHAM_ID = '" + opts.id + "'";
    break;
  }
  return que;
}


/**
 * MSSQL DB update 확인(type:: 'sunab': , 'Rc':'', 'Ix':'', 'Tx':'')
 * @caution:
 * @param  string  $id      CHARTID(CHAM_ID)
 * @param  string  $date    확인 날짜
 * @return
 */
function _isDone(opts, cb) {
  var que = _isDoneMSQue(opts);

  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });

}


function _isDoneMSQue(opts) {
  var id = opts.id;
  //var ohis = mH_utils.OHIS(id);
  var ohis = opts.ohis;
  var date = opts.date;

  var date_ = date.substring(6,8);
  var month = date.substring(0,6);

  switch(opts.type) {
  case 'sunab' :  //['TOTAL']
    return "SELECT JUBM_MTAMT AS TOTAL FROM Month.dbo.JUBM" + month +
          " WHERE JUBM_DATE = '" + opts.date_ +"' AND JUBM_CHAM_ID = '" + opts.id + "' AND JUBM_MTAMT > 0";
    //break;
  case 'Rc' :
    return "SELECT OSSC_DATE AS OSSC_DATE FROM OHIS_H.dbo.OSSC" + opts.ohis +
         " OSSC_DATE = '" + opts.date +"' AND OSSC_CHAM_ID = '" + opts.id + "'";
    //break;
  case 'Ix' :
    return "SELECT ODIS_CHAM_ID AS CHAM_ID FROM Month.dbo.ODIS" + month +
          " WHERE ODIS_DATE = '" + opts.date_ +"' AND ODIS_CHAM_ID = '" + opts.id + "'";
    //break;
  case 'Tx' :
    return "SELECT OENT_CHAM_ID AS CHAM_ID FROM Month.dbo.OENT" + month +
          " WHERE OENT_DATE = '" + opts.date_ +"' AND OENT_CHAM_ID = '" + opts.id + "'";
    //break;
  default :
    return '';
    //break;
  }
}


//-----------------------------------------------------------------------------
// EXPORTS
//-----------------------------------------------------------------------------
//exports.readChartRc = _readChartRc;
//exports.createChartRc = _createChartRc;
exports.updateChartRc = _updateChartRc;
exports.updateChartRc = _updateChartRc;
exports.deleteChartRc = _deleteChartRc;
exports.readChartOsscs = _readChartOsscs;
//exports.readChartIxs = _readChartIxs;
exports.readChartIx = _readChartIx;
exports.createChartIxs = _createChartIxs;
exports.createChartIx = _createChartIx;
exports.updateChartIxs = _updateChartIxs;
exports.updateChartIx = _updateChartIx;
exports.updateChartIxs = _updateChartIxs;
exports.updateChartIx = _updateChartIx;
exports.deleteChartIxs = _deleteChartIxs;
exports.deleteChartIx = _deleteChartIx;
exports.searchIx = _searchIx;
exports.getPrmIxs = _getPrmIxs;
//exports.getPrmIxs = _getPrmIxs;
//exports.readChartTxs = _readChartTxs;
//exports.readChartTxs = _readChartTxs;
exports.readChartTx = _readChartTx;
exports.createChartTxs = _createChartTxs;
exports.createChartTx = _createChartTx;
exports.updateChartTxs = _updateChartTxs;
exports.updateChartTx = _updateChartTx;
exports.updateChartTxs = _updateChartTxs;
exports.updateChartTx = _updateChartTx;
exports.deleteChartTxs = _deleteChartTxs;
exports.deleteChartTx = _deleteChartTx;
//exports.searchAcu = _searchAcu;
exports.getMommDataMY = _getMommDataMY;
exports.getMommDataMS = _getMommDataMS;
//exports.getPrmAcus = _getPrmAcus;
exports.getAcuCodes = _getAcuCodes;
//exports.getAcuCodes = _getAcuCodes;
exports.getPrmGroups = _getPrmGroups;
//exports.getPrmGroups = _getPrmGroups;
exports.getPrmTxs = _getPrmTxs;
//exports.getPrmTxs = _getPrmTxs;




//=================================


////===========================================================================
//// header for crossDomain request
////===========================================================================
/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, PATCH, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-Requested-With, X-File-Name");
header('Content-Type', 'application/json');

require '../Slim/Slim.php';
require '../utils.php';

$app = new Slim();

////===========================================================================
//// app router
////===========================================================================
//-----------------------------------------------------------------------------
// !!!Test
//-----------------------------------------------------------------------------
$app->get('/compare', '_compareJson');


//-----------------------------------------------------------------------------
// ChartDR
//-----------------------------------------------------------------------------
$app->get('/ChartRc/:ref_date/:cur_date/:id', 'readChartRc');
$app->post('/ChartRc/:ref_date/:cur_date/:id', 'createChartRc');
$app->put('/ChartRc/:ref_date/:cur_date/:id', 'updateChartRc');
$app->patch('/ChartRc/:ref_date/:cur_date/:id', 'updateChartRc');
$app->delete('/ChartRc/:ref_date/:cur_date/:id', 'deleteChartRc');

$app->get('/ChartOsscs/:id', 'readChartOsscs');

//-----------------------------------------------------------------------------
// ChartIx
//-----------------------------------------------------------------------------
$app->get('/ChartIxs/:ref_date/:cur_date/:id', 'readChartIxs');
$app->get('/ChartIxs/:ref_date/:cur_date/:id/:seq', 'readChartIx'); //NOT USED
$app->post('/ChartIxs/:ref_date/:cur_date/:id', 'createChartIxs');
$app->post('/ChartIxs/:ref_date/:cur_date/:id/:seq', 'createChartIx');  //forced POST, NOT USED
$app->patch('/ChartIxs/:ref_date/:cur_date/:id', 'updateChartIxs');
$app->patch('/ChartIxs/:ref_date/:cur_date/:id/:seq', 'updateChartIx'); //NOT USED
$app->put('/ChartIxs/:ref_date/:cur_date/:id', 'updateChartIxs');
$app->put('/ChartIxs/:ref_date/:cur_date/:id/:seq', 'updateChartIx'); //NOT USED
$app->delete('/ChartIxs/:ref_date/:cur_date/:id', 'deleteChartIxs');
$app->delete('/ChartIxs/:ref_date/:cur_date/:id/:seq', 'deleteChartIx'); //NOT USED

$app->get('/searchIx/:term', 'searchIx');

$app->get('/getPrmIxs', 'getPrmIxs');  //약속 상병 목록
$app->get('/getPrmIxs/:term', 'getPrmIxs');  //약속 상병 검색 결과 목록
//-----------------------------------------------------------------------------
// ChartTx
//-----------------------------------------------------------------------------
$app->get('/ChartTxs/:ref_date/:cur_date/:id', 'readChartTxs');
//$app->get('/ChartTxs/:ref_date/:cur_date/:id', 'readChartTxs');
$app->get('/ChartTxs/:ref_date/:cur_date/:id/:seq', 'readChartTx'); //NOT USED
$app->post('/ChartTxs/:ref_date/:cur_date/:id', 'createChartTxs');
$app->post('/ChartTxs/:ref_date/:cur_date/:id/:seq', 'createChartTx');  //forced POST, NOT USED
$app->patch('/ChartTxs/:ref_date/:cur_date/:id', 'updateChartTxs');
$app->patch('/ChartTxs/:ref_date/:cur_date/:id/:seq', 'updateChartTx'); //NOT USED
$app->put('/ChartTxs/:ref_date/:cur_date/:id', 'updateChartTxs');
$app->put('/ChartTxs/:ref_date/:cur_date/:id/:seq', 'updateChartTx'); //NOT USED
$app->delete('/ChartTxs/:ref_date/:cur_date/:id', 'deleteChartTxs');
$app->delete('/ChartTxs/:ref_date/:cur_date/:id/:seq', 'deleteChartTx'); //NOT USED

$app->get('/searchAcu/:term', 'searchAcu');

$app->get('/getMommDataMY/:id', 'getMommDataMY');
$app->get('/getMommDataMS/:id', 'getMommDataMS');

$app->get('/getPrmAcus', 'getPrmAcus');

//$app->get('/getAcuCodes/:term', 'getAcuCodes');
$app->post('/getAcuCodes', 'getAcuCodes');


$app->get('/getPrmGroups', 'getPrmGroups');  //약속 상병/치료 목록
$app->get('/getPrmGroups/:term', 'getPrmGroups');  //약속 상병/치료 검색 결과 목록

$app->get('/getPrmTxs', 'getPrmTxs');  //약속 치료 목록
$app->get('/getPrmTxs/:term', 'getPrmTxs');  //약속 치료 검색 결과 목록
//ChartTxs/20140205/20140419/0000000492
//-----------------------------------------------------------------------------
// Accessory
//-----------------------------------------------------------------------------


$app->run();
*/
////===========================================================================
//// app function
////===========================================================================
//-----------------------------------------------------------------------------
// ChartDR
//-----------------------------------------------------------------------------
/**
 * READ ChartRc(진료기록, 신상기록, 특이사항)
 * @caution:
 * @param  string    $ref_date  참조일
 * @param  string    $cur_date  편집일
 * @param  string    $id        차트아이디(CHARTID/CHAM_ID)
 * @return echo json
 */
/*function readChartRc($ref_date, $cur_date, $id) {

    if (mH_isDoneRc($id, $cur_date)) {
      $ref_date = $cur_date;
    }

    $rs = array(
            'OSSC_PF'=>'',
            'JINMEMO_MEMO'=>'',
            'REMK_REMARK'=>''
            );
    $rs['OSSC_PF'] = _readOssc($id, $ref_date);
    $rs['JINMEMO_MEMO'] = _readJinmemo($id);
    $rs['REMK_REMARK'] = _readRemark($id);
    echo json_encode($rs);
}*/


/**
 * CREATE ChartRc(진료기록, 신상기록, 특이사항)
 * @caution:
 * @param  string    $ref_date  참조일
 * @param  string    $cur_date  편집일
 * @param  string    $id        차트아이디(CHARTID/CHAM_ID)
 * @return echo json
 */
/*function createChartRc($ref_date, $cur_date, $id) {
    //$data = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));
    _createChartRc($id, $cur_date, $_REQUEST);  //create or update

}*/

/**
 * UPDATE ChartRc
 * @caution: !!!$date param, sync MSSQL -> mysql / PUT, PATCH
 * @param  string  $date
 * @return echo json
 */
/*function updateChartRc($ref_date, $cur_date, $id) {
  $arrPatient = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));
  //echo json_encode($arrPatient);

  $sql = "UPDATE `patient_$date` SET " . mH_getUpdStr($arrPatient) . " WHERE CHARTID = '$id'";
  mH_executeMSSQL($sql);

}*/

/**
 * DELETE patient
 * @caution: !!!$date param, sync MSSQL -> mysql / PUT, PATCH
 * @param  string  $date
 * @return echo json
 */
/*function deleteChartRc($ref_date, $cur_date, $id) {

  $sql = "DELETE FROM `patient_$date` WHERE CHARTID = $id";
  mH_executeMSSQL($sql);

  //MSSQL delete: 사용자별 지원 여부 결정
}*/


/**
 * READ Ossc(진료기록 목록)
 * @caution:
 * @param  string  $date
 * @return echo json
 */
/*function readChartOsscs($id) {
    echo json_encode(_readOsscs($id));
}*/
//-----------------------------------------------------------------------------
// ChartIx
//-----------------------------------------------------------------------------
/**
 * READ ChartIxs(상병 전체)
 * @caution:
 * @param  string  $date
 * @return echo json
 */
/*function readChartIxs($ref_date, $cur_date, $id) {
  if (mH_isDoneIx($id, $cur_date)) {
    $ref_date = $cur_date;
  }
  echo json_encode(_readChartIxs($id, $ref_date));
}*/


/**
 * READ ChartIx(상병)
 * @caution: NOT USED
 * @param  string  $date
 * @return echo json
 */
/*function readChartIx($ref_date, $cur_date, $id, $seq) {
  if (mH_isDoneIx($id, $cur_date)) {
    $ref_date = $cur_date;
  }
  //echo json_encode(_readChartIx($id, $ref_date, $seq));
}*/


/**
 * CREATE ChartIxs(상병)
 * @caution:
 * @param  string    $ref_date  참조일
 * @param  string    $cur_date  편집일
 * @param  string    $id        차트아이디(CHARTID/CHAM_ID)
 * @return echo json
 */
/*function createChartIxs($ref_date, $cur_date, $id) {
    //$data = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));
    _createChartIxs($id, $cur_date, $_REQUEST);  //create or update

}*/


/**
 * READ 각종 기록(진료기록,신상기록,특이사항)
 * @caution: !!!$date param, sync MSSQL -> mysql
 * @param  string  $date
 * @return echo json
 */
/*function searchIx($term) {
    echo json_encode(_searchIx($term));
}*/


//-----------------------------------------------------------------------------
// ChartTx
//-----------------------------------------------------------------------------
/**
 * READ 각종 기록(진료기록,신상기록,특이사항)
 * @caution: !!!$date param, sync MSSQL -> mysql
 * @param  string  $date
 * @return echo json
 */
/*function readChartTxs($ref_date, $cur_date, $id) {
  if (mH_isDoneTx($id, $cur_date)) {
    $ref_date = $cur_date;
  }
  echo json_encode(_readChartTxs($id, $ref_date));
}*/

/**
 * CREATE ChartTxs(치료)
 * @caution:
 * @param  string    $ref_date  참조일
 * @param  string    $cur_date  편집일
 * @param  string    $id        차트아이디(CHARTID/CHAM_ID)
 * @return echo json
 */
/*function createChartTxs($ref_date, $cur_date, $id) {
    //$data = mH_objToArr(json_decode(urldecode(Slim::getInstance()->request()->getBody())));
    _createChartTxs($id, $cur_date, $_REQUEST);  //create or update
}*/

/**
 * MOMM DATA 반환
 * @caution: NOT YET
 * @param  string  $id      MOMM_ID
 * @return echo    json     name, price,
 */
/*function getMommDataMY($id) {
    echo json_encode(_getMommDataMY($id));
}*/


/**
 * MOMM DATA 반환
 * @caution:
 * @param  string  $id      MOMM_ID
 * @return echo    json     name, price,
 */
/*function getMommDataMS($id) {
    echo json_encode(_getMommDataMS($id));
}*/

/**
 * 약속 경혈 반환
 * @caution:
 * @param
 * @return echo    json array     ,
 */
/*function getPrmAcus() {
    echo json_encode(_getPrmAcus());
}*/


/**
 * 약속 경혈 반환
 * @caution:
 * @param
 * @return echo    json array     ,
 */
//function getAcuCodes($term) {
/*function getAcuCodes() {
    //print_r($_REQUEST);
    //echo json_encode(_getAcuCodes($term));
    echo json_encode(_getAcuCodes($_REQUEST['term']));
}*/


/**
 * 약속 상병/치료 목록 반환
 * @caution:
 * @param
 * @return echo    json array     ,
 */
/*function getPrmGroups($term='') {
    //print_r($_REQUEST);
    //echo json_encode(_getAcuCodes($term));
    echo json_encode(_getPrmGroups($term));
}*/

/**
 * 약속 상병 목록 반환
 * @caution:
 * @param
 * @return echo    json array     ,
 */
/*function getPrmIxs($term='') {
    //print_r($_REQUEST);
    //echo json_encode(_getAcuCodes($term));
    echo json_encode(_getPrmIxs($term));
}*/

/**
 * 약속 치료 목록 반환
 * @caution:
 * @param
 * @return echo    json array     ,
 */
/*function getPrmTxs($term='') {
    //print_r($_REQUEST);
    //echo json_encode(_getAcuCodes($term));
    echo json_encode(_getPrmTxs($term));
}*/
//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
// Accessory
//-----------------------------------------------------------------------------



////===========================================================================
//// private function
////===========================================================================
//-----------------------------------------------------------------------------
// ChartDR
//-----------------------------------------------------------------------------

/**
 * 약속 경혈(한글 경혈명 추가!!)
 * @caution: //SELECT BLOD_HNAME FROM hanimacCS.dbo.H_BLOD WHERE BLOD_ID = 'LI002'
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _getPrmAcus() {
    $sql = "SELECT ASK_ID AS ASK_ID, ASK_NAME AS ASK_NAME FROM hanimacCS.dbo.CC_ASK
            WHERE ASK_BIGO LIKE '약속경혈%' ORDER BY ASK_SEQ";
    $rs = mH_selectArrayMSSQL($sql);
        foreach($rs as &$row) {
            $row['BLOD_HNAME'] = '';
            $arrAcuId = explode('/', $row['ASK_NAME']);
            foreach($arrAcuId as $acuId) {
                //echo($acuId . '|');
                if(!empty($acuId)) {
                    $row['BLOD_HNAME'] .= _getAcuHname($acuId) . '/';
                }
            }
        }
    return $rs;
}*/



/**
 * 입력 추가 경혈 (혈명, 코드) 반환
 * @caution:
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _getAcuCodes($term) {
    //$term = $_REQUEST['term'];
    $arrName_ = explode('/', $term);
    $arrName = array_filter(array_map('trim', $arrName_));  //배열에서 빈값 제거

    $data = array('Acu1'=>array(), 'Acu2'=>array());

    foreach ($arrName as $name) {
        $sql = "SELECT BLOD_ID AS code, BLOD_HNAME AS name FROM hanimacCS.dbo.H_BLOD WHERE BLOD_HNAME  LIKE '{$name}%'";
        $rs = mH_selectArrayMSSQL($sql);

        if(!empty($rs) && sizeof($rs) == 1) {
            $data['Acu1'][] = $rs[0];
        } else if(sizeof($rs) > 1) {
            foreach ($rs as &$row) {
                //$code = $row['code'];
                //$data['PX2'][$code] = $row['name'];
                $data['Acu2'][] = $row;
            }
        }

    }
    return $data;
}*/


/**
 * 약속 상병 Title값(distinct) 반환
 * @caution:
 * @param
 * @return
 */
/*function __getPrmTitle() {
  $sql = "SELECT distinct(rtrim(Title)) AS Title
          FROM hanimacCS.dbo.PROMISE50";
  $rs = mH_selectArrayMSSQL($sql);

  return $rs;
}*/

/*function _getPrmTitle($type='상병명') {
  $sql = "SELECT distinct(rtrim(Title)) AS Title
          FROM hanimacCS.dbo.PROMISE50
          WHERE CLS = '$type'";
  $rs = mH_selectArrayMSSQL($sql);

  return $rs;
}*/


/**
 * 해당월 내원일
 * @caution:
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _readVisitDate($id, $date) {
    $year =  substr($date, 0, 4);
    $month = substr($date, 0, 6);
    //$date_ = substr($date, 6, 2);
    $from = $month.'00';
    $to = $month.'32';

    $sql = "SELECT substring(R_DATE, 7, 2) as visit FROM month.dbo.BEAN$year
        WHERE R_CHAM_ID = '$id'
        AND R_DATE > $from AND R_DATE < $to";
    return mH_selectArrayMSSQL($sql);

}*/

////!!!!NOT YET
/**
 * 환경 변수: _PHOTOPATH, _BEDNUM, _TXTIME, IPNUM(ip 주소), _PHOTOWEB(사진 web 주소)
 * @caution:
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _readEnvironment() {
    //$sql = Array();
    //SELECT TOP 1 HOSD_DATA AS _CHOMIN FROM hanimacCS.dbo.HOSD50 where HOSD_NAME = '초진산정날짜수'
    //SELECT TOP 1 HOSD_DATA AS _DTIMER FROM hanimacCS.dbo.HOSD50 where HOSD_NAME = '치료실_타이머'
    //SELECT TOP 1 HOSD_DATA AS _ALARM FROM hanimacCS.dbo.HOSD50 where HOSD_NAME LIKE '치료실_치료종료알람%'
    $ret = array();
    //$arrV = array();
    $arrSql['_PHOTOPATH'] = "SELECT HOSD_DATA AS _PHOTOPATH FROM hanimacCS.dbo.HOSD50
            WHERE HOSD_NAME = '사진_저장하는경로' AND substring(HOSD_DATA, 2, 1) = ':'";
    $arrSql['_BEDNUM'] = "SELECT HOSD_DATA AS _BEDNUM FROM hanimacCS.dbo.HOSD50
            WHERE HOSD_NAME = '치료실_베드갯수'";
    $arrSql['_TXTIME'] = "SELECT TOP 2 HOSD_DATA AS _TXTIME FROM hanimacCS.dbo.HOSD50
            WHERE HOSD_NAME LIKE '%치료실_치료블럭%' ORDER BY HOSD_NAME";

    try {
        $db = getMSConnection();
        //$arrV = array();
        foreach($arrSql as $key=>$sql) {
            $sql = iconv('UTF-8', 'CP949', $sql);
            $stmt = $db->query($sql);
            $rs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach($rs as $k=>$v) {
                array_push($ret, $v);
            }
        }
        $db = null;

        $strTime = '';
        $ret2 = array();
        foreach ($ret as $key=>$val) {
            foreach($val as $key2=>$val2) {
                if ($key2 == '_TXTIME') {   //'_TXTIME'은 별도 관리...
                    $strTime .= $val2 . ',';
                } else {
                    $ret2[$key2] = $val2;
                }
            }
        }

        //$strTime = substr ($strTime, 0,  strlen($strTime) - 1);   //맨 끝에 ',' 없애기
        //$arrTime['_TXTIME'] = explode(",", $strTime);
        //$ret2['_TXTIME'] = $arrTime['_TXTIME'];
        $ret2['_TXTIME'] = explode(",", $strTime);
        //array_splice($ret, 2, 2); //$ret에서 index가 2인[3번째] 요소부터 2개 지우기
        //array_push($ret, $arrTime);

        //echo json_encode(mH_CP949_UTF8($ret));
        echo json_encode(mH_CP949_UTF8($ret2));
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}*/