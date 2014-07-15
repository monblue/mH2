//-----------------------------------------------------------------------------
// REQUIRE
//-----------------------------------------------------------------------------
var mH_utils = require('../mH_utils');
var async = require('async');
var dateFormat = require('dateformat');


//-----------------------------------------------------------------------------
// FUNCTIONS
//-----------------------------------------------------------------------------
/**
* @function:
* @caution:
*/
var _readChartRc = function(req, res) {
  var ohis = mH_utils.OHIS(id);
  var opts = {"id":req.params.id, "date":req.params.cur_date, "ohis":ohis, "type":"Rc"};
  var ref_date = opts.ref_date;
  _isDone(opts, function(err, rs){
    if (!rs || !rs.length) {
      ref_date = cur_date;
    }

  async.parallel([
    function(cb) { job('p1', cb) }, // function(cb) { _readChartRcPart('Ossc', cb); };
    function(cb) { job('p2', cb) }
  ], function(err, results) {
    console.log('results=%j', results);
  });

  })
/*
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
*/

/*
var async=require('async');
// gen an integer between 1 and max
function gen_rnd(max) {
        return Math.floor( (Math.random()*max+1)*1000 );
}

function job(lbl, cb) {
        console.log('Job %s started', lbl);
        console.time(lbl+'-timer');
        setTimeout( function() {
                console.timeEnd(lbl+'-timer');
                cb(null, lbl.toUpperCase());
        }, gen_rnd(5) );
}

console.time('all jobs');
async.parallel([
        function(cb) { job('p1',cb) },
        function(cb) { job('p2',cb) }
], function(err, results) {
        console.log('do something else upon completion of p1 and p2');
        console.log('results=%j', results);
        console.timeEnd('all jobs');
});
*/

}

/**
* @function:
* @caution:
*/
var _createChartRc = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartRc = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _updateChartRc = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _deleteChartRc = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _readChartOsscs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _readChartIxs = function(req, res) {

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

}

/**
* @function:
* @caution:
*/
var _getPrmIxs = function(req, res) {

}

/**
* @function:
* @caution:
*/
var _getPrmIxs = function(req, res) {

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




/*=================================
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
 * 수납 여부 확인
 * @caution:
 * @param  string  $id      CHARTID(CHAM_ID)
 * @param  string  $date    확인 날짜
 * @return
 */
function _isDoneSunab(opts, cb) {
  var id = opts.id;
  var date = opts.date;
  var date_ = date.substring(6,8);
  var month = date.substring(0,6);

  var que = "SELECT JUBM_MTAMT AS TOTAL FROM Month.dbo.JUBM" + month +
            " WHERE JUBM_DATE = '" + date_ +"' AND JUBM_CHAM_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    //res.send(rs[0]['TOTAL']);
    cb(err, rs[0]['TOTAL']);
  });
}








/**
 * 진료기록
 * @caution:
 * @param  string  $date
 * @return array
 */
function _readOsscs($id) {
    $OHIS = mH_OHISNum($id);
    //print_r($sql);
    //$sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, distinct CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
    $sql = "SELECT TOP 10 OSSC_DATE AS OSSC_DATE, CAST(OSSC_PF AS text) AS OSSC_PF FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' ORDER BY OSSC_DATE DESC";
    //print_r($sql);
    return mH_selectArrayMSSQL($sql);
    //return $rs;
    //return $rs['OSSC_PF'];
}









/**
 * 기록 저장 여부 확인
 * @caution:
 * @param  string  $id      CHARTID(CHAM_ID)
 * @param  string  $date    확인 날짜
 * @return
 */
function _isDoneRc(opts, cb) {
  var id = opts.id;
  var date = opts.date;
  var ohis = mH_utils.OHIS(id);

  var que = "SELECT OSSC_DATE AS OSSC_DATE FROM OHIS_H.dbo.OSSC" + ohis +
            " OSSC_DATE = '" + date +"' AND OSSC_CHAM_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
/*
    $sql = "SELECT OSSC_DATE AS OSSC_DATE FROM OHIS_H.dbo.OSSC$OHIS
        WHERE OSSC_CHAM_ID = '$id' AND OSSC_DATE = '$date'";

    //echo $sql;
    $rs = mH_selectRowMSSQL($sql);
    return $rs['OSSC_DATE'];
*/
}

/**
 * 상병 저장 여부 확인
 * @caution:
 * @param  string  $id      CHARTID(CHAM_ID)
 * @param  string  $date    확인 날짜
 * @return
 */
function _isDoneIx(opts, cb) {
  var id = opts.id;
  var date = opts.date;
  var date_ = date.substring(6,8);
  var month = date.substring(0,6);

  var que = "SELECT ODIS_CHAM_ID AS CHAM_ID FROM Month.dbo.ODIS" + month +
            " WHERE ODIS_DATE = '" + date_ +"' AND ODIS_CHAM_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
/*
    $sql = "SELECT ODIS_CHAM_ID AS CHAM_ID FROM Month.dbo.ODIS$month
        WHERE ODIS_CHAM_ID = '$id' AND ODIS_DATE = '$date_'";

    //echo $sql;
    $rs = mH_selectRowMSSQL($sql);
    return $rs['CHAM_ID'];
*/
}

/**
 * 치료 저장 여부 확인
 * @caution:
 * @param  string  $id      CHARTID(CHAM_ID)
 * @param  string  $date    확인 날짜
 * @return
 */

//function mH_isDoneTx($id, $date) {
function _isDoneTx(opts, cb) {
  var id = opts.id;
  var date = opts.date;
  var date_ = date.substring(6,8);
  var month = date.substring(0,6);

  var que = "SELECT OENT_CHAM_ID AS CHAM_ID FROM Month.dbo.OENT" + month +
            " WHERE OENT_DATE = '" + date_ +"' AND OENT_CHAM_ID = '" + id + "'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
/*
    $sql = "SELECT OENT_CHAM_ID AS CHAM_ID FROM Month.dbo.OENT$month
        WHERE OENT_CHAM_ID = '$id' AND OENT_DATE = '$date_'";

    //echo $sql;
    $rs = mH_selectRowMSSQL($sql);
    return $rs['CHAM_ID'];
*/
}