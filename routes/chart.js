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
/**
* @function:
* @caution:
*/
var _readChartRc = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  //var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"Rc"};
  //var ref_date = opts.ref_date;
  var opts = {"id":req.params.id, "date":req.params.ref_date, "ohis":ohis, "type":"Rc"};
  _isDone(opts, function(err, rs) {
    if (rs || rs.length) {  //Rc가 입력되어있는 경우 현재 날짜 데이터 가져옴@@@
      //ref_date = cur_date;
      opts.date = cur_date;
    }

    async.parallel([
      function(callback) {
        opts.type = 'Ossc';
        //var que = _readRcMSQue({"date":date, "type":'Ossc'});
        var que = _readRcMSQue(opts);
        console.log(que);
        mH_utils.msQueryRs({"que":que}, function(err, rs){
          callback(err, rs);
        });
      },

      function(callback) {
        opts.type = 'Jinmemo';
        //var que = _readRcMSQue({"date":date, "type":'Jinmemo'});
        var que = _readRcMSQue(opts);
        console.log(que);
        mH_utils.msQueryRs({"que":que}, function(err, rs){
          callback(err, rs);
        });
      },

      function(callback) {
        opts.type = 'Jinmemo';
        //var que = _readRcMSQue({"date":date, "type":'Remark'});
        var que = _readRcMSQue(opts);
        console.log(que);
        mH_utils.msQueryRs({"que":que}, function(err, rs){
          callback(err, rs);
        });
      },
    ],

    // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
    function(err, results) {
      var rs2 = {};
      console.log(results[0], results[1]);
      rs2['OSSC_PF'] = results[0];
      rs2['JINMEMO_MEMO'] = results[1];
      rs2['REMK_REMARK'] = results[2];
      res.send(rs2);  //response
    });
  });
}

/**
* @function:
* @caution:
*/
/*
var _createChartRc = function(req, res) {
  var ohis = mH_utils.OHIS(req.params.id);
  var RcTx = mH_utils.trim(req.body.OSSC_PF);
  var RcJm = mH_utils.trim(req.body.JINMEMO_MEMO);
  var RcRm = mH_utils.trim(req.body.REMK_REMARK);
  var opts = {"id":req.params.id, "date":req.params.date, "ohis":ohis};
}
*/

var _createChartRc = function(req, res) {

  var data = {  //test용
    "MEMD":"D0",
    "GWAM":"80",
    "FDOC":"D1".
    "LDOC":"D2"
  };

  var rc = {
    "RcTx":"진료기록 테스트",
    "RcJm":"신상기록 테스트",
    "RcRm":"특이사항 테스트",
  };

  var ohis = mH_utils.OHIS(req.params.id);
  opts = {
    "id":req.params.id,
    "date":req.params.date,
    "ohis":ohis,
    "data":data  //@@@@@@@@@@@
  };
/*
  opts = {
    "id":req.params.id,
    "date":req.params.date,
    "ohis":ohis,
    "data":req.body.data  //@@@@@@@@@@@
  };
*/
  async.parallel([
    function(callback) {  //1x
      opts.type = 'RcTx';
      //opts.rc = req.body.RcTx;  //trim@@@@@@
      opts.rc = rc.RcTx;  //trim@@@@@@ 테스트용
      _createRcPr(opts, callback);
    },
    function(callback) {  //2x
      opts.type = 'RcJm';
      //opts.rc = req.body.RcTx;  //trim@@@@@@
      opts.rc = rc.RcJm;  //trim@@@@@@ 테스트용
      _createRcPr(opts, callback);
    },
    function(callback) {  //3x
      opts.type = 'RcRm';
      //opts.rc = req.body.RcTx;  //trim@@@@@@
      opts.rc = rc.RcRm;  //trim@@@@@@ 테스트용
      _createRcPr(opts, callback);
    }
  ],

  //callback
  function(err, results) {
    var rs2 = {};
    console.log(results[0], results[1], results[2]);
    rs2['OSSC_PF'] = results[0];
    rs2['JINMEMO_MEMO'] = results[1];
    rs2['REMK_REMARK'] = results[2];
    res.send(rs2);  //response
  });
}


function _createRcPr(opts, callback) {
  var que = _checkRcMSQue(opts);
  console.log(que);
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    //callback(err, rs);
    if (rs) {
      que = _createRcMSQue(opts);
    } else {
      que = _updateRcMSQue(opts);
    }
    mH_utils.msQueryRs({"que":que}, function(err, rs){
      callback(err, rs);
    });
  });
}


function _checkRcMSQue(opts) {
  var type = opts.type;
  var id = opts.id;
  var date = opts.date;
  var ohis = opts.ohis;

  switch(type) {
  case 'RcTx':
    que = "SELECT OSSC_CHAM_ID FROM OHIS_H.dbo.OSSC" + ohis +
          " WHERE OSSC_CHAM_ID = '" + id +
          "' AND OSSC_DATE = '" + date + "'";
    break;
  case 'RcJm':
    que = "SELECT JINMEMO_CHAM_ID FROM hanimacCS.dbo.CC_JINMEMO" +
          " WHERE JINMEMO_CHAM_ID = '" + id + "'";
    break;
  case 'RcRm':
    que = "SELECT REMK_CHAM_ID FROM hanimacCS.dbo.CC_REMK" +
          " WHERE REMK_CHAM_ID = '" + id + "'";
    break;
  }

}


function _createRcMSQue(opts) {
  var type = opts.type;
  var id = opts.id;
  var date = opts.date;
  var ohis = opts.ohis;
  var rc = opts.rc;  //rc: RcTx, RcJm, RcRm
  var data = opts.data;

  switch(type) {
  case 'RcTx':
    pre = "INSERT INTO OHIS_H.dbo.OSSC" + ohis + " ";
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


function _updateRcMSQue(opts) {
  var type = opts.type;
  var id = opts.id;
  var date = opts.date;
  var ohis = opts.ohis;
  var rc = opts.rc;  //rc: RcTx, RcJm, RcRm

  switch(type) {
  case 'RcTx':
    que = "UPDATE OHIS_H.dbo.OSSC" + ohis +
          " SET OSSC_PF = '" + rc
          "' WHERE OSSC_CHAM_ID = '" + id +
          "' AND OSSC_DATE = '" + date + "'";
    break;
  case 'RcJm':
    que = "UPDATE hanimacCS.dbo.CC_JINMEMO SET JINMEMO_MEMO = '" +
          rc + "', JINMEMO_DATE = '" + date +
          "' WHERE JINMEMO_CHAM_ID = '" + id + "'";
    break;
  case 'RcRm':
    que = "UPDATE hanimacCS.dbo.CC_REMK SET REMK_REMARK = '" +
          rc + "' WHERE REMK_CHAM_ID = '" + id + "'";
    break;
  }

  return que;
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
    " FROM OHIS_H.dbo.OSSC" + ohis +
    " WHERE OSSC_CHAM_ID = '" + id +
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
var _readChartIxs = function(req, res) {
/*
    $month = substr($date, 0, 6);
    $date_ = substr($date, 6, 2);

    $sql = "SELECT odis.ODIS_SEQ as seq, odis.ODIS_BIGO1 as ODSC_BIGO1, odis.ODIS_DISM_ID as ODSC_DISM_ID,
            (case
            when odis.ODIS_BIGO1 != ''
            then (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_KEY = odis.ODIS_BIGO1 )
            else (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_ID = odis.ODIS_DISM_ID )
            end) as ixName
            FROM Month.dbo.ODIS$month as odis
            WHERE odis.ODIS_CHAM_ID = '$id' AND  odis.ODIS_DATE = '$date_'
            ORDER BY odis.ODIS_SEQ";
*/
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
/*
    //$OHIS = mH_OHISNum($id);

    //이미 수납처리된 데이터가 있는 경우 처리@@@
    if (mH_isDoneSunab($id, $date) > 0) {
        echo '{"res":"D"}';
        return;
    }


    $month = substr($date, 0, 6);
    $date_ = substr($date, 6, 2);
    $ixItems = $data['items'];
    //'ODIS_MEDM_ID'=>$data['MEDM'],
    //ODIS_GWAM_ID'=>$data['GWAM'],

    //이미 입력된 데이터가 있는 경우 처리@@@@@[DELETE + INSERT
    $sql = "SELECT ODIS_CHAM_ID FROM Month.dbo.ODIS$month
        WHERE ODIS_CHAM_ID = '$id' AND ODIS_DATE = '$date_'";

    $rs = mH_selectRowMSSQL($sql);

    if (!empty($rs)) { //delete(message 보내야 함!!!!])
        $sql = "DELETE Month.dbo.ODIS$month
                WHERE ODIS_CHAM_ID = '$id' AND ODIS_DATE = '$date_'" . "\n";
        //echo '{"res":"N"}';
        //return;
    }


    //create(insert)
    $seq = 0;
    $max = sizeof($ixItems);

    for ($i = 0; $i < $max; ++$i) {

        $seq += 1; // for : 중간에 데이터가 없는 경우 고려
        $main = ($seq == 1) ? '주' : '';
        $ODIS_DISM_ID = $ixItems[$i]['ODSC_DISM_ID'];
        $ODIS_BIGO1 = $ixItems[$i]['ODSC_BIGO1'];

        $arrIns = array(
            'ODIS_DATE'=>$date_,
            'ODIS_CHAM_ID'=>$id,
            'ODIS_DISM_ID'=>$ODIS_DISM_ID,
            'ODIS_SEQ'=>$seq,
            'ODIS_BIGO'=>$main,
            'ODIS_BIGO1'=>$ODIS_BIGO1,
            'ODIS_MEDM_ID'=>$data['MEDM'],
            'ODIS_GWAM_ID'=>$data['GWAM'],
            'ODIS_DISM_ID1'=>'',    //?
            'ODIS_GWAM_ID1'=>'',    //?
            'ODIS_VCODE'=>'',       //희귀 난치성?
            'ODIS_SANG'=>''         //?
        );
        //print_r(mH_getInsStr($arrIns));
        $sql .= "INSERT INTO Month.dbo.ODIS$month " . mH_getInsStr($arrIns) . "\n";

    }
*/
}

/**
* @function:
* @caution:
*/
var _createChartIx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartIxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartIx = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartIxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartIx = function(req, res) {

}

/**
* @function:
* @caution:
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
/*
    $term = str_replace('.', '', $term);    //#### '.' 없앰, check항목 더 만들어야...

    if (substr_count($term, ' ') > 0) {
        $arrKey = explode(' ', $term);
        foreach($arrKey as $val) {
            $arrWhere[] = "DISM_HNAME LIKE '%$val%'";
        }
        $strWhere = implode(' AND ', $arrWhere);
        } else {
        $strWhere = "DISM_HNAME LIKE '%$term%'";
    }
    $strWhere .= " AND DISM_NP != 'N'";

    //TOP 20: 20개만 불러옴
    $sql = "SELECT TOP 20 DISM_HNAME as name, DISM_KEY as key1, DISM_ID as code FROM hanimacCS.dbo.CC_DISM_2011 WHERE "
                .$strWhere." ORDER BY DISM_HNAME";

   return mH_selectArrayMSSQL($sql);
*/
}

/**
* @function:
* @caution:
*/
var _getPrmIxs = function(req, res) {
/*
  $where = '';
  if ($term != '') {
  //if (!$term) {
    $where = " AND Title LIKE '%$term%'";
  }

  $sql = "SELECT  rtrim(Title) AS Title,
                  rtrim(CodeName) AS NAME,
                  rtrim(Code) AS DISM_ID,
                  rtrim(CodeExp) AS DISM_KEY
          FROM hanimacCS.dbo.PROMISE50
          WHERE CLS = '상병명' ".
          $where .
          " ORDER BY Title";
  return mH_selectArrayMSSQL($sql);
*/
}

//-----------------------------------------------------------------------------
// ChartTx
//-----------------------------------------------------------------------------
/**
* @function:
* @caution:
*/
var _getPrmTxs = function(req, res) {
  $where = '';
  if ($term != '') {
  //if (!$term) {
    $where = " AND Title LIKE '%$term%'";
  }
/*
//CodeExp2 AS MOMM_DBL: 보험약 2배수 (1:default, 2:2배수)
//group by CNT@@@@@@@@@@

  $sql = "SELECT  rtrim(Title) AS Title,
                  rtrim(CLS) AS CLS,
                  rtrim(CodeName) AS CodeName,
                  rtrim(Code) AS Code,
                  rtrim(CodeExp) AS CodeExp,
                  rtrim(CodeExp1) AS CodeExp1,
                  rtrim(CodeExp2) AS CodeExp2
          FROM hanimacCS.dbo.PROMISE50
          WHERE CLS != '상병명' ".
          $where .
          " ORDER BY Title";
          //" ORDER BY Title, Seq";
  return mH_selectArrayMSSQL($sql);
*/
}

/**
* @function:
* @caution:
*/
var _readChartTxs = function(req, res) {

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
* @caution:
*/
var _searchAcu = function(req, res) {

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

}

/**
* @function:
* @caution:
*/
var _getPrmAcus = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getAcuCodes = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getAcuCodes = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getPrmGroups = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getPrmGroups = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getPrmTxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getPrmTxs = function(req, res) {

}



//-----------------------------------------------------------------------------
// FUNCTIONS
//-----------------------------------------------------------------------------
function _readRcMSQue(opts) {
  var id = opts.id;
  var date = opts.date;
  var ohis = opts.ohis;
  var type = opts.type;
/*
    //$OHIS = mH_OHISNum($id);
    //print_r($sql);

    $sql = "SELECT CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";

    $sql = "SELECT CAST(JINMEMO_MEMO AS text) AS JINMEMO_MEMO FROM hanimacCS.dbo.CC_JINMEMO
        WHERE JINMEMO_CHAM_ID = '$id'";

    $sql = "SELECT  CAST(REMK_REMARK AS text) AS REMK_REMARK FROM hanimacCS.dbo.CC_REMK
        WHERE REMK_CHAM_ID = '$id'";
*/
}



//-----------------------------------------------------------------------------
// EXPORTS
//-----------------------------------------------------------------------------
exports.readChartRc = _readChartRc;
exports.createChartRc = _createChartRc;
exports.updateChartRc = _updateChartRc;
exports.updateChartRc = _updateChartRc;
exports.deleteChartRc = _deleteChartRc;
exports.readChartOsscs = _readChartOsscs;
exports.readChartIxs = _readChartIxs;
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
exports.getPrmIxs = _getPrmIxs;
exports.readChartTxs = _readChartTxs;
exports.readChartTxs = _readChartTxs;
exports.readChartTx = _readChartTx;
exports.createChartTxs = _createChartTxs;
exports.createChartTx = _createChartTx;
exports.updateChartTxs = _updateChartTxs;
exports.updateChartTx = _updateChartTx;
exports.updateChartTxs = _updateChartTxs;
exports.updateChartTx = _updateChartTx;
exports.deleteChartTxs = _deleteChartTxs;
exports.deleteChartTx = _deleteChartTx;
exports.searchAcu = _searchAcu;
exports.getMommDataMY = _getMommDataMY;
exports.getMommDataMS = _getMommDataMS;
exports.getPrmAcus = _getPrmAcus;
exports.getAcuCodes = _getAcuCodes;
exports.getAcuCodes = _getAcuCodes;
exports.getPrmGroups = _getPrmGroups;
exports.getPrmGroups = _getPrmGroups;
exports.getPrmTxs = _getPrmTxs;
exports.getPrmTxs = _getPrmTxs;




//=================================
/*
function _createRcPr(opts, callback) {
      var que = _checkRcMSQue(opts);
      console.log(que);
      mH_utils.msQueryRs({"que":que}, function(err, rs){
        //callback(err, rs);
        if (rs) {
          que = _createRcMSQue(opts);
        } else {
          que = _updateRcMSQue(opts);
        }
        mH_utils.msQueryRs({"que":que}, function(err, rs){
          callback(err, rs);
        });
      });
}
*/

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
          " WHERE JUBM_DATE = '" + date_ +"' AND JUBM_CHAM_ID = '" + id + "' AND JUBM_MTAMT > 0";
    //break;
  case 'Rc' :
    return "SELECT OSSC_DATE AS OSSC_DATE FROM OHIS_H.dbo.OSSC" + ohis +
         " OSSC_DATE = '" + date +"' AND OSSC_CHAM_ID = '" + id + "'";
    //break;
  case 'Ix' :
    return "SELECT ODIS_CHAM_ID AS CHAM_ID FROM Month.dbo.ODIS" + month +
          " WHERE ODIS_DATE = '" + date_ +"' AND ODIS_CHAM_ID = '" + id + "'";
    //break;
  case 'Tx' :
    return "SELECT OENT_CHAM_ID AS CHAM_ID FROM Month.dbo.OENT" + month +
          " WHERE OENT_DATE = '" + date_ +"' AND OENT_CHAM_ID = '" + id + "'";
    //break;
  default :
    return '';
    //break;
  }
}



/**
 * 진료기록
 * @caution:
 * @param  string  $date
 * @return array
 */
function _readOsscs($id) {
/*
    $OHIS = mH_OHISNum($id);
    //print_r($sql);
    //$sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, distinct CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
    $sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' ORDER BY OSSC_DATE DESC";
    //print_r($sql);
    return mH_selectArrayMSSQL($sql);
    //return $rs;
    //return $rs['OSSC_PF'];
*/
}





////=========================================
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
 * 진료기록
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _readOsscs($id) {
    $OHIS = mH_OHISNum($id);
    //print_r($sql);
    //$sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, distinct CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
    $sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' ORDER BY OSSC_DATE DESC";
    //print_r($sql);
    return mH_selectArrayMSSQL($sql);
    //return $rs;
    //return $rs['OSSC_PF'];
}*/


/**
 * 진료기록
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _readOssc($id, $date) {
    $OHIS = mH_OHISNum($id);
    //print_r($sql);

    $sql = "SELECT CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";
    //print_r($sql);
    $rs = mH_selectRowMSSQL($sql);
    //return $rs;
    return $rs['OSSC_PF'];
}*/

/**
 * 신상기록
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _readJinmemo($id) {
    $sql = "SELECT CAST(JINMEMO_MEMO AS text) AS JINMEMO_MEMO FROM hanimacCS.dbo.CC_JINMEMO
        WHERE JINMEMO_CHAM_ID = '$id'";
    //print_r($sql);
    $rs = mH_selectRowMSSQL($sql);
    //return $rs;
    return $rs['JINMEMO_MEMO'];
}*/

/**
 * 특이사항
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _readRemark($id) {
    $sql = "SELECT  CAST(REMK_REMARK AS text) AS REMK_REMARK FROM hanimacCS.dbo.CC_REMK
        WHERE REMK_CHAM_ID = '$id'";
    //print_r($sql);
    $rs = mH_selectRowMSSQL($sql);

    //return $rs;
    return $rs['REMK_REMARK'];
}*/


/**
 * 진료기록 저장(insert or update)
 * @caution: !!!create or update
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $date        편집일
 * @param  string  $data        OSSC_PF
 * @return
 */
/*function _createChartRc($id, $date, $data) {
    $OHIS = mH_OHISNum($id);
    $RcTx = trim($data['items']['OSSC_PF']);
    $RcJm = trim($data['items']['JINMEMO_MEMO']);
    $RcRm = trim($data['items']['REMK_REMARK']);

    ////진료기록
    $sql = "SELECT OSSC_CHAM_ID FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";
    $rs = mH_selectRowMSSQL($sql);

    if (!$rs) { //count = 0
        $arrIns = array(
            'OSSC_MEDM_ID'=>$data['MEDM'],
            'OSSC_CHAM_ID'=>$id,
            'OSSC_GWAM_ID'=>$data['GWAM'],
            'OSSC_DATE'=>$date,
            'OSSC_PF'=>$RcTx,
            'OSSC_FDOC_ID'=>$data['FDOC'],
            'OSSC_LDOC_ID'=>$data['LDOC']
        );

        $sql = "INSERT INTO OHIS_H.dbo.OSSC$OHIS " . mH_getInsStr($arrIns);
        echo('진료기록 Ins' . $sql);

    } else {  //update

        $sql = "UPDATE OHIS_H.dbo.OSSC$OHIS
            SET OSSC_PF = '$RcTx'
            WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";
        echo('진료기록 Upd' . $sql);
    }

    mH_executeMSSQL($sql);
    echo('진료기록 처리');


    ////신상기록
    //신상기록이 비어있지 않은 경우에 실행
    if ($RcJm) {
        $sql = "SELECT JINMEMO_CHAM_ID FROM hanimacCS.dbo.CC_JINMEMO
            WHERE JINMEMO_CHAM_ID = '$id'";
        $rs = mH_selectRowMSSQL($sql);

        if ($rs == 0) { //count = 0
            $arrIns = array(
                'JINMEMO_CHAM_ID'=>$id,
                'JINMEMO_GWAM_ID'=>$data['GWAM'],
                'JINMEMO_DATE'=>$date,
                'JINMEMO_MEMO'=>'$RcJm',
                'JINMEMO_USRM_ID'=>$data['FDOC']    //FDOC, LDOC, USRM
            );

            $sql = "INSERT INTO hanimacCS.dbo.CC_JINMEMO " . mH_getInsStr($arrIns);
            echo('신상기록 Ins' . $sql);

        } else {  //update

            $sql = "UPDATE hanimacCS.dbo.CC_JINMEMO
                SET JINMEMO_MEMO = '$RcJm', JINMEMO_DATE = '$date'
                WHERE JINMEMO_CHAM_ID = '$id'";
            echo('신상기록 upd' . $sql);
        }

        mH_executeMSSQL($sql);
        echo('신상기록 처리');
    }


    ////특이사항
    //특이사항이 비어있지 않은 경우에 실행
    if ($RcRm) {
        $sql = "SELECT REMK_CHAM_ID FROM hanimacCS.dbo.CC_REMK
                WHERE REMK_CHAM_ID = '$id'";
        $rs = mH_selectRowMSSQL($sql);

        if ($rs == 0) { //count = 0
            $arrIns = array(
                'REMK_CHAM_ID'=>$id,
                'REMK_REMARK'=>'$RcRm',
                'REMK_DOC_ID'=>$data['FDOC']    //FDOC, LDOC, USRM
            );

            $sql = "INSERT INTO hanimacCS.dbo.CC_REMK " . mH_getInsStr($arrIns);
            echo('특이사항 Ins' . $sql);

        } else {  //update

            $sql = "UPDATE hanimacCS.dbo.CC_REMK
                    SET REMK_REMARK = '$RcRm'
                    WHERE REMK_CHAM_ID = '$id'";
            echo('특이사항 upd' . $sql);
        }

        mH_executeMSSQL($sql);
        echo('특이사항 처리');
    }

}*/


/**
 * 진료기록
 * @caution: NOT USED
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $date    편집일
 * @param  string  $data        OSSC_PF
 * @return
 */
/*function _createOssc($id, $date, $data) {
    $OHIS = mH_OHISNum($id);

    $sql = "SELECT OSSC_CHAM_ID FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";
    $rs = mH_selectRowMSSQL($sql);

    //echo 'count(OSSC_CHAM_ID)' . $rs;

    if (!$rs) { //count = 0
        $arrIns = array(
            'OSSC_MEDM_ID'=>$data['MEDM'],
            'OSSC_CHAM_ID'=>$id,
            'OSSC_GWAM_ID'=>$data['GWAM'],
            'OSSC_DATE'=>$date,
            'OSSC_PF'=>$data['OSSC_PF'],
            'OSSC_FDOC_ID'=>$data['FDOC'],
            'OSSC_LDOC_ID'=>$data['LDOC']
        );

        $sql = "INSERT INTO OHIS_H.dbo.OSSC$OHIS " . mH_getInsStr($arrIns);

    } else {  //update

        $sql = "UPDATE OHIS_H.dbo.OSSC$OHIS
            SET OSSC_PF = '$RcTx'
            WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";
    }

    mH_executeMSSQL($sql);

}*/


/**
 * 신상기록
 * @caution: NOT USED
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $data
 * @return
 */
/*function _createJinmemo($id, $data) {
    //
}*/


/**
 * 특이사항
 * @caution: NOT USED
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $data
 * @return
 */
/*function _createRemark($id, $data) {
    //
}*/



//-----------------------------------------------------------------------------
// ChartIx
//-----------------------------------------------------------------------------
/**
 * 상병 데이터
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _readChartIxs($id, $date) {
    //$sql = "SELECT odsc.ODSC_SEQ as seq, odsc.ODSC_BIGO1 as ixKey, odsc.ODSC_DISM_ID as ixId,
    $month = substr($date, 0, 6);
    $date_ = substr($date, 6, 2);

    $sql = "SELECT odis.ODIS_SEQ as seq, odis.ODIS_BIGO1 as ODSC_BIGO1, odis.ODIS_DISM_ID as ODSC_DISM_ID,
            (case
            when odis.ODIS_BIGO1 != ''
            then (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_KEY = odis.ODIS_BIGO1 )
            else (SELECT DISM_HNAME FROM hanimacCS.dbo.CC_DISM_2011 WHERE DISM_ID = odis.ODIS_DISM_ID )
            end) as ixName
            FROM Month.dbo.ODIS$month as odis
            WHERE odis.ODIS_CHAM_ID = '$id' AND  odis.ODIS_DATE = '$date_'
            ORDER BY odis.ODIS_SEQ";
    //echo($sql);
    return mH_selectArrayMSSQL($sql);
}*/


/**
 * 상병 저장(insert or update)
 * @caution: !!!create or update
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $date        편집일
 * @param  string  $data        OSSC_PF
 * @return
 */
/*function _createChartIxs($id, $date, $data) {
    //$OHIS = mH_OHISNum($id);

    //이미 수납처리된 데이터가 있는 경우 처리@@@
    if (mH_isDoneSunab($id, $date) > 0) {
        echo '{"res":"D"}';
        return;
    }


    $month = substr($date, 0, 6);
    $date_ = substr($date, 6, 2);
    $ixItems = $data['items'];
    //'ODIS_MEDM_ID'=>$data['MEDM'],
    //ODIS_GWAM_ID'=>$data['GWAM'],

    //이미 입력된 데이터가 있는 경우 처리@@@@@[DELETE + INSERT
    $sql = "SELECT ODIS_CHAM_ID FROM Month.dbo.ODIS$month
        WHERE ODIS_CHAM_ID = '$id' AND ODIS_DATE = '$date_'";

    $rs = mH_selectRowMSSQL($sql);

    if (!empty($rs)) { //delete(message 보내야 함!!!!])
        $sql = "DELETE Month.dbo.ODIS$month
                WHERE ODIS_CHAM_ID = '$id' AND ODIS_DATE = '$date_'" . "\n";
        //echo '{"res":"N"}';
        //return;
    }


    //create(insert)
    $seq = 0;
    $max = sizeof($ixItems);

    for ($i = 0; $i < $max; ++$i) {

        $seq += 1; // for : 중간에 데이터가 없는 경우 고려
        $main = ($seq == 1) ? '주' : '';
        $ODIS_DISM_ID = $ixItems[$i]['ODSC_DISM_ID'];
        $ODIS_BIGO1 = $ixItems[$i]['ODSC_BIGO1'];

        $arrIns = array(
            'ODIS_DATE'=>$date_,
            'ODIS_CHAM_ID'=>$id,
            'ODIS_DISM_ID'=>$ODIS_DISM_ID,
            'ODIS_SEQ'=>$seq,
            'ODIS_BIGO'=>$main,
            'ODIS_BIGO1'=>$ODIS_BIGO1,
            'ODIS_MEDM_ID'=>$data['MEDM'],
            'ODIS_GWAM_ID'=>$data['GWAM'],
            'ODIS_DISM_ID1'=>'',    //?
            'ODIS_GWAM_ID1'=>'',    //?
            'ODIS_VCODE'=>'',       //희귀 난치성?
            'ODIS_SANG'=>''         //?
        );
        //print_r(mH_getInsStr($arrIns));
        $sql .= "INSERT INTO Month.dbo.ODIS$month " . mH_getInsStr($arrIns) . "\n";

    }

    //echo ($sql);
    mH_executeMSSQL($sql);

}*/


/**
 * 상병 검색(상병 코드, 이름, key 반환)
 * @caution:
 * @param  string  $date
 * @return array
 */
/*function _searchIx($term) {
    $term = str_replace('.', '', $term);    //#### '.' 없앰, check항목 더 만들어야...

    if (substr_count($term, ' ') > 0) {
        $arrKey = explode(' ', $term);
        foreach($arrKey as $val) {
            $arrWhere[] = "DISM_HNAME LIKE '%$val%'";
        }
        $strWhere = implode(' AND ', $arrWhere);
        } else {
        $strWhere = "DISM_HNAME LIKE '%$term%'";
    }
    $strWhere .= " AND DISM_NP != 'N'";

    //TOP 20: 20개만 불러옴
    $sql = "SELECT TOP 20 DISM_HNAME as name, DISM_KEY as key1, DISM_ID as code FROM hanimacCS.dbo.CC_DISM_2011 WHERE "
                .$strWhere." ORDER BY DISM_HNAME";

   return mH_selectArrayMSSQL($sql);

}*/


//-----------------------------------------------------------------------------
// ChartTx
//-----------------------------------------------------------------------------
/**
 * 치료 데이터
 * @caution: 진찰료 및 할증, 비보험 제외@@@@//조제료: OPSC_TOTAL = 0, OPSC_GASAN2 = 1, OPSC_HANG = 3, OPSC_MOK = 2, OPSC_RNO = 3 //보험약 구성 단위: select * from ohis_h.dbo.opsc0012 where opsc_total > 1 // 보험약 구성단위, 비보험 제외@@@
 * @param  string  $date
 * @return array
 */
/*function _readChartTxs($id, $date) {
    $OHIS = mH_OHISNum($id);

    $sql = "SELECT OPSC_MOMM_ID, OPSC_ORDER, OPSC_BIGO2, OPSC_BLOD, OPSC_BIGO5, OPSC_AMT, OPSC_DAY
            FROM OHIS_H.dbo.OPSC$OHIS
            WHERE OPSC_CHAM_ID = '$id' AND OPSC_DATE = '$date' AND substring(OPSC_MOMM_ID, 1, 2) != '10' AND OPSC_TOTAL < 2 AND OPSC_BIGUB = '0'
            ORDER BY OPSC_SEQ";
    $rs = mH_selectArrayMSSQL($sql);

    return $rs;
}*/



/**
 * 치료 저장(insert or update)
 * @caution: !!!create or update
 * @param  string  $id          CHARTID(CHAM_ID)
 * @param  string  $date        편집일
 * @param  string  $data        OSSC_PF
 * @return
 */
/*function _createChartTxs($id, $date, $data) {
    //이미 수납처리된 데이터가 있는 경우 처리@@@
    if (mH_isDoneSunab($id, $date) > 0) {
        echo '{"res":"D"}';
        return;
    }

    $OHIS = mH_OHISNum($id);
    $month = substr($date, 0, 6);
    $date_ = substr($date, 6, 2);
    $txItems = $data['items'];
    //'ODIS_MEDM_ID'=>$data['MEDM'],
    //ODIS_GWAM_ID'=>$data['GWAM'],
    //OENT_LICENSE, OENT_NAME@@@@@@@

    //이미 입력된 데이터가 있는 경우 처리@@@@@[DELETE + INSERT
    $sql = "SELECT OENT_CHAM_ID FROM Month.dbo.OENT$month
        WHERE OENT_CHAM_ID = '$id' AND OENT_DATE = '$date_'";
    $rs = mH_selectRowMSSQL($sql);

    if (!empty($rs)) { //delete(message 보내야 함!!!!])
        $sqlOENT = "DELETE Month.dbo.OENT$month
                WHERE OENT_CHAM_ID = '$id' AND OENT_DATE = '$date_'" . "\n";
        $sqlOPSC = "DELETE OHIS_H.dbo.OPSC$OHIS
                WHERE OPSC_CHAM_ID = '$id' AND OPSC_DATE = '$date'" . "\n";
        mH_executeMSSQL($sqlOENT);
        mH_executeMSSQL($sqlOPSC);

    }

    $sqlOENT = '';
    $sqlOPSC = '';

    $max = sizeof($txItems);
    for ($i = 0; $i < $max; ++$i) {

        $seq = $i + 1;
        $mommId = $txItems[$i]['OPSC_MOMM_ID'];
        $momrId = $mommId;  //없애도 되는지 테스트@@@@@@@@@
        $gubun = 0;
        $bigo2 = $txItems[$i]['OPSC_BIGO2'];
        $blod = $txItems[$i]['OPSC_BLOD'];    //'자락'이 입력되는 에러 테스트용
        //$blod = '';    //'자락'이 입력되는 에러 테스트용
        $bigo5 = str_replace(' ', '', $txItems[$i]['OPSC_BIGO5']);    //자락이 뜨는 에러 해결@@@@@@@@@@
        $name = $txItems[$i]['OPSC_ORDER'];   //보험약의 경우 OPSC_ORDER가 없으면 달력에 'EX'표시 되지 않음!!!@@@
        $amt = 1;
        $day = 1;
        $bibo = 0;

        //@@@보험약, group외 다른 확인방법??
        if ($txItems[$i]['group'] == '15' || $txItems[$i]['group'] == '15_1') {
            $amt = $txItems[$i]['OPSC_AMT'];
            $day = $txItems[$i]['OPSC_DAY'];

            if (substr($mommId, 1, 1) == 'C' || substr($momrId, 1, 1) == 'G') {
                $gubun = 6;
                $momrId = str_replace('`', '', $mommId);  //없애도 되는지 테스트@@@@@@@@@
            } else {
                $gubun = 5;
            }
        }

        //@@@비보험, group외 다른 확인방법??
        if ($txItems[$i]['group'] > 50) {
            //$bibo = $txItems[$i]['price'];
            $bibo = '1';    //OENT_BIGUB: 1
        }

        $dataOENT = array(
            'OENT_MEDM_ID'=>$data['MEDM'],
            'OENT_DATE'=>$date_,
            'OENT_CHAM_ID'=>$id,
            'OENT_GWAM_ID'=>$data['GWAM'],
            'OENT_CNT'=>$seq,
            //'OENT_RNO'=>'',
            //'OENT_NO'=>'',
            'OENT_MOMR_ID'=>$momrId,
            'OENT_MOMM_ID'=>$mommId,
            'OENT_BLOD'=>$blod,
            //'OENT_DANGA'=>'',
            'OENT_AMT'=>$amt,
            'OENT_ONE_AMT'=>'1',
            'OENT_DAY'=>$day,
            //'OENT_USGM_ID'=>'',
            //'OENT_INOUT'=>'0',
            //'OENT_EX_CODE'=>'',
            'OENT_BIGUB'=>$bibo,
            'OENT_GASAN1'=>'0', //0이 아닌 경우 확인요@@@@@
            'OENT_GASAN2'=>'0', //0이 아닌 경우 확인요@@@@@
            //'OENT_DEPT_ID'=>'',
            //'OENT_GRP_NAME'=>'',
            'OENT_GUBUN'=>$gubun,   //0이 아닌 경우 확인요@@@@@
            //'OENT_SUGI'=>'0',
            //'OENT_TOTAL'=>'0',
            //'OENT_SUP_ID'=>'',
            //'OENT_SUP_NAME'=>'',
            'OENT_TRANS_NO'=>'0',   //필수!!! 0이 아닌 경우 확인요@@@@@
            'OENT_DOC_ID'=>$data['LDOC'],
            //'OENT_HCODE'=>'',
            //'OENT_BIGO1'=>'',
            'OENT_BIGO2'=>$data['MEDM'], // OENT_MEDM_ID와 항상 같은지 확인요
            'OENT_BIGO3'=>$bigo2,   //OPSC에서는 BIBO2!!!!!
            //'OENT_LICENSE'=>'20289',
            //'OENT_NAME'=>'문정삼'
        );

        //비보험 단가(보험 단가가 자동으로 계산된다면 그냥 넣어도 됨@@@@@@@@)
        if ($txItems[$i]['group'] > 50) {
            $dataOENT['OENT_DANGA'] = $txItems[$i]['price'];
        }

        $dataOPSC = array(
            'OPSC_MEDM_ID'=>$data['MEDM'],
            'OPSC_CHAM_ID'=>$id,
            'OPSC_GWAM_ID'=>$data['GWAM'],
            'OPSC_DATE'=>$date,
            'OPSC_SEQ'=>$seq,
            //'OPSC_RNO'=>'1',
            'OPSC_BLOD'=>$blod,
            'OPSC_ORDER'=>$name,    //보험약의 경우 OPSC_ORDER가 없으면 달력에 'EX'표시 되지 않음!!!
            'OPSC_MOMR_ID'=>$momrId,
            'OPSC_MOMM_ID'=>$mommId,
            //'OPSC_DANGA'=>'6960',
            'OPSC_AMT'=>$amt,
            'OPSC_ONE_AMT'=>'1',
            'OPSC_DAY'=>$day,
            //'OPSC_USG'=>'',
            //'OPSC_INOUT'=>'0',
            //'OPSC_EX_CODE'=>'',
            'OPSC_BIGUB'=>$bibo,
            'OPSC_GASAN1'=>'0',
            'OPSC_GASAN2'=>'0',
            //'OPSC_HANG'=>'1',
            //'OPSC_MOK'=>'2',
            //'OPSC_HEANG'=>'0',
            //'OPSC_DEPT_ID'=>'',
            //'OPSC_LINK_CODE'=>'',
            //'OPSC_GRP_NAME'=>'',
            'OPSC_GUBUN'=>$gubun,
            'OPSC_TOTAL'=>'0',
            //'OPSC_SUP_ID'=>'',
            //'OPSC_SUP_NAME'=>'',
            'OPSC_TRANS_NO'=>'0',
            //'OPSC_HCODE'=>'',
            //'OPSC_ACTING'=>'',
            //'OPSC_FDOC_ID'=>$data['FDOC'],
            //'OPSC_LDOC_ID'=>$data['LDOC'],
            //'OPSC_CHEOPSU'=>'',
            //'OPSC_PACK_NUMBER'=>'',
            //'OPSC_ILBUN'=>'',
            //'OPSC_DESC'=>'',
            //'OPSC_HPACK_MEMO'=>'',
            //'OPSC_BIGO1'=>'',
            'OPSC_BIGO2'=>$bigo2,
            //'OPSC_BIGO3'=>'',
            //'OPSC_BIGO4'=>'',
            'OPSC_BIGO5'=>$bigo5,
            //'OPSC_BIGO6'=>NULL,
            //'OPSC_BIGO7'=>NULL,
            //'OPSC_BIGO8'=>NULL
        );

        if ($txItems[$i]['group'] > 50) {   //비보험 단가(보험 단가가 자동으로 계산된다면 그냥 넣어도 됨@@@@@@@@)
            $dataOPSC['OPSC_DANGA'] = $txItems[$i]['price'];
        }

        //print_r($dataOENT);
        //print_r($dataOPSC);

        $sqlOENT .= "INSERT INTO Month.dbo.OENT$month " . mH_getInsStr($dataOENT) . "\n";

        $sqlOPSC .= "INSERT INTO OHIS_H.dbo.OPSC$OHIS " . mH_getInsStr($dataOPSC) . "\n";

    }

    //print_r($sqlOENT);
    //print_r($sqlOPSC);
    mH_executeMSSQL($sqlOENT);
    mH_executeMSSQL($sqlOPSC);

}*/


/**
 * MOMM DATA 반환
 * @caution: NOT YET
 * @param  string  $id      MOMM_ID
 * @return echo    json     name, price,
 */
/*function _getMommDataMY($id) {
}*/


/**
 * MOMM DATA 반환
 * @caution:
 * @param  string  $id      MOMM_ID
 * @return echo    json     name, price,
 */
/*function _getMommDataMS($id) {
    //SELECT  MOMM_ID, MOMM_HNAME, MOMM_HANG, MOMM_MOK, MOMM_GUBUN, MOMM_BIGUB, MOMM_ROUND, MOMM_HYANG, MOMM_M1_SUGA, MOMM_M1_DATE, MOMM_DISK_GUBUN, MOMM_BIGO1, MOMM_BIGO2
    //FROM hanimacCS.dbo.CC_MOMM
    //WHERE (len(MOMM_ID) = 5 or (len(MOMM_ID) = 8 AND substring(MOMM_ID, 6,2) = '00')) AND isnumeric(substring(MOMM_ID, 1, 1)) > 0  AND MOMM_M1_SUGA > 0 AND MOMM_BIGUB = 0 AND (MOMM_HNAME not like '%병원%' AND MOMM_HNAME not like '%한방과%' AND MOMM_HNAME not like '%-의원%' AND MOMM_HNAME not like '%식%')

    $sql = "SELECT MOMM_HNAME AS name, MOMM_M1_SUGA AS price FROM hanimacCS.dbo.CC_MOMM
        WHERE MOMM_ID = '$id'";
    $rs = mH_selectRowMSSQL($sql);
    return $rs;
}*/


/**
 * 입력 추가 경혈 (혈명, 코드) 반환
 * @caution:
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _searchAcu() {
    $term = $_REQUEST['term'];
    $arrName_ = explode('/', $term);
    $arrName = array_filter(array_map('trim', $arrName_));  //배열에서 빈값 제거

    foreach ($arrName as $name) {
        $sql = "SELECT BLOD_ID AS code, BLOD_HNAME AS name FROM hanimacCS.dbo.H_BLOD WHERE BLOD_HNAME  LIKE '{$name}%'";
        $rs = mH_selectArrayMSSQL($sql);
        if(!empty($rs) && sizeof($rs) == 1) {
            $data['PX1'][] = $rs[0];
        } else if(sizeof($rs) > 1) {
            foreach ($rs as &$row) {
                //$code = $row['code'];
                //$data['PX2'][$code] = $row['name'];
                $data['PX2'][] = $row;
            }
        }

    }
    //echo json_encode(mH_CP949_UTF8($data));
    return $data;
}*/


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
 * 한글 경혈명 얻기
 * @caution:
 * @param  string  term    $_REQUEST['term']
 * @return
 */
/*function _getAcuHname($AcuId) {
    $sql = "SELECT BLOD_HNAME AS BLOD_HNAME
        FROM hanimacCS.dbo.H_BLOD
        WHERE BLOD_ID = '$AcuId'";
    $rs = mH_selectRowMSSQL($sql);
    return $rs['BLOD_HNAME'];
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
 * 약속 상병/치료 목록 반환
 * @caution:
 * @param
 * @return
 */
/*function _getPrmGroups($term='') {

  $where = '';
  if ($term != '') {
  //if (!$term) {
    $where = " WHERE Title LIKE '%$term%'";
  }

  $sql = "SELECT  Title AS TITLE,
                  CodeName AS NAME,
                  Code AS DISM_ID,
                  CodeExp AS DISM_KEY,
                  Code AS MOMM_ID,
                  CodeExp AS MOMM_AMT,
                  CodeExp1 AS MOMM_DAY,
                  CodeExp2 AS MOMM_DBL
          FROM hanimacCS.dbo.PROMISE50" .
          $where;
  echo($sql);
  //print_r(mH_selectArrayMSSQL($sql));
  return mH_selectArrayMSSQL($sql);
}*/

/**
 * 약속 상병 목록 반환
 * @caution:
 * @param
 * @return
 */
/*function _getPrmIxs($term='') {
  $where = '';
  if ($term != '') {
  //if (!$term) {
    $where = " AND Title LIKE '%$term%'";
  }

  $sql = "SELECT  rtrim(Title) AS Title,
                  rtrim(CodeName) AS NAME,
                  rtrim(Code) AS DISM_ID,
                  rtrim(CodeExp) AS DISM_KEY
          FROM hanimacCS.dbo.PROMISE50
          WHERE CLS = '상병명' ".
          $where .
          " ORDER BY Title";
  return mH_selectArrayMSSQL($sql);


}*/

/**
 * 약속 치료 목록 반환
 * @caution:
 * @param
 * @return
 */
/*function _getPrmTxs($term='') {
  $where = '';
  if ($term != '') {
  //if (!$term) {
    $where = " AND Title LIKE '%$term%'";
  }

//CodeExp2 AS MOMM_DBL: 보험약 2배수 (1:default, 2:2배수)
//group by CNT@@@@@@@@@@

  $sql = "SELECT  rtrim(Title) AS Title,
                  rtrim(CLS) AS CLS,
                  rtrim(CodeName) AS CodeName,
                  rtrim(Code) AS Code,
                  rtrim(CodeExp) AS CodeExp,
                  rtrim(CodeExp1) AS CodeExp1,
                  rtrim(CodeExp2) AS CodeExp2
          FROM hanimacCS.dbo.PROMISE50
          WHERE CLS != '상병명' ".
          $where .
          " ORDER BY Title";
          //" ORDER BY Title, Seq";
  return mH_selectArrayMSSQL($sql);

  //기본치료+(경혈/투자/자락관법.... 등은 기본치료항목에 병합시켜야 함!!!)
  // CLS LIKE '기본치료%' AND len(CLS) > 4

}*/


/**
 * 약속 상병 CNT값(distinct) 반환
 * @caution:
 * @param
 * @return
 */
/*function _getPrmCNT() {
  $sql = "SELECT distinct(CNT) AS CNT FROM hanimacCS.dbo.PROMISE50";
  $rs = mH_selectArrayMSSQL($sql);
  $ret = array();
  foreach($rs as $val) {
    array_push($ret, $val['CNT']);
  }
  return $ret;
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