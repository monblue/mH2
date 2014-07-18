//-----------------------------------------------------------------------------
// MSSQL: npm mssql / npm tedious
//-----------------------------------------------------------------------------
var mssql = require('mssql');
var _ = require('underscore');
//var request = new mssql.Request();

//require 시켜야 하지 않나? dbconfig.js로
var mssqlconfig = {
    user: 'haniMS',
    password: 'MShani',
    server: '192.168.0.11\\hanimacCS2', // You can use 'localhost\\instance' to connect to named instance
    //server: 'http://monwater.iptime.org\\hanimacCS2', // You can use 'localhost\\instance' to connect to named instance
    database: 'hanimacCS',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

//-----------------------------------------------------------------------------
// MongoDB
//-----------------------------------------------------------------------------
var mongo = require('mongodb');
var MgServer = mongo.Server;
var MgDb = mongo.Db;
var BSON = mongo.BSONPure;
var mgserver = new MgServer('localhost', 27017, {auto_reconnect: true});

mgdb = new MgDb('txdb', mgserver, {safe: true});

mgdb.open(function(err, mgdb) {
  if(!err) {
    //console.log("Connected to 'bookdb' database");
    mgdb.collection('txRecord', {safe:true}, function(err, collection) {
      if (err) {
        console.log("The 'txRecord' collection doesn't exist. Creating it with sample data...");
        //populateDB();
      }
    });
  }
});

//-----------------------------------------------------------------------------
// exports:: mongodb CRUD functions
//-----------------------------------------------------------------------------
exports.mgCreateRs = function(opts, cb) {
  mgdb.collection(opts.col, function(err, collection) {
    collection.insert(opts.body, {safe:true}, function(err, rs) {
      cb(err, rs);
    });
  });
};


exports.mgReadAllRs = function(opts, cb) {
  var filter = opts.filter || {};
  mgdb.collection(opts.col, function(err, collection) {
    collection.find(filter).toArray(function(err, rs) {
      cb(err, rs);
    });
  });
}


exports.mgReadOneRs = function(opts, cb) {
  var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  mgdb.collection(opts.col, function(err, collection) {
    collection.findOne(filter, function(err, rs) {
      cb(err, rs);
    });
  });
};


exports.mgReadFieldsRs = function(opts, cb) {
  var filter = opts.filter || {};
  var fields = opts.fields || {};
  mgdb.collection(opts.col, function(err, collection) {
    collection.find(filter, fields).toArray(function(err, rs) {
      cb(err, rs);
    });
  });
}

exports.mgUpdateRs = function(opts, cb) {
  var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  mgdb.collection(opts.col, function(err, collection) {
    collection.update(filter, opts.body, {safe:true}, function(err, rs) {
      cb(err, rs);
    });
  });
}


exports.mgDeleteRs = function(opts, cb) {
  var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  mgdb.collection(opts.col, function(err, collection) {
    collection.remove(filter, {safe:true}, function(err, rs) {
      cb(err, rs);
    });
  });
}

//-----------------------------------------------------------------------------
// exports:: mongodb NON-CRUD functions
//-----------------------------------------------------------------------------
exports.mgFindRs = function(req, res, opts) {
  var que = req.body.que;

  //var filter = new RegExp(req.query.keyword, '');
  //collection.find({or:[{_t:{elemMatch:{t:filter}}},{_t:filter},{_o:filter}]}, {_t:1}).toArray(function(err, docs) {

  console.log('find query ', que);
  mgdb.collection(opts.col, function(err, collection) {
    collection.find(que).toArray(function(err, rs) {
      res.send(rs);
    });
  });
};

//부분 UPDATE
exports.mgPatchRs = function(opts, cb) {
  var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  var item = opts.body;

  mgdb.collection(opts.col, function(err, collection) {
    collection.update(filter, { $set: item }, {safe:true}, function(err, rs) {
      cb(err, rs);
    });
  });
}


//-----------------------------------------------------------------------------
// exports:: MSSQL QUERY functions
//-----------------------------------------------------------------------------
exports.msQueryRs = function(opts, cb) {
  mssql.connect(mssqlconfig, function(err) {
    var request = new mssql.Request();
    request.query(opts.que, function(err, rs) {
      cb(err, rs);
    });
  });
}


//-----------------------------------------------------------------------------
// exports : Util Functions
//-----------------------------------------------------------------------------
/**
 * json 배열 a, b를 key를 기준으로 비교하여 add, del, upd를 반환
 * @caution: default key = 'id'
 * @param   json array   a    비교 대상 json array
 * @param   json array   b    비교 기준 json array
 * @param   string     key  비교 기준 key
 * @return  json object     {add:[], del:[], upd:[]}
 */
//exports.compareJsonArr = function(a, b, key) {
exports.compareJsonArr = function(opts, cb) {
  var a = opts.a || {};
  var b = opts.b || {};
  var key = opts.key || 'CHARTID';

  var arrAdd = [];
  var arrDel = [];
  var arrUpd = [];

  _.each(a, function(unit) {
    if (!_.findWhere(b, unit)) {
      if (_.find(b, function(item){ return item[key] == unit[key]; })) {
        arrUpd.push(unit);
      } else {
        arrAdd.push(unit);
      }
    }
  });

  _.each(b, function(unit) {
    if (!_.find(a, function(item){ return item[key] == unit[key]; })) {
      //console.log('key, b', key, unit[key]);
      arrDel.push(unit);
    }
  });

  var num = arrAdd.length + arrDel.length + arrUpd.length;

  cb({"add":arrAdd, "del":arrDel, "upd":arrUpd, "num":num});
  //return {add:arrAdd, del:arrDel, upd:arrUpd};
}



//exports.OHISNum = _getOHISNum;

exports.OHISNum = function(id, cb) {
  var num = Math.ceil((parseInt(id) + 390)/500) + 9;
    if ((parseInt(id) + 390)%1000 == 500) num++;
    cb(_putZeros(num, 4));
    //return _putZeros(num, 4);
}


//exports.insuType = _insuType;

exports.insuType = function(pPart, pCare, pCard) {  //Kind of Health Insurance Card
//insuKind = _insuType(0, 2, 5-4201472332);
    pCare = pCare - 1;
    pCard = pCard.substr(0, 1) - 1;

    partArr = {'1':'일반', '2':'Insu', '5':'Care', '7':'자보'};
    careArr = ['보호1', '보호2', '#3', '#4', '차상위1', '차상위2', '차2장', '2장', '#9'];
    cardArr = ['지역', '지역', '지역', '지역', '공교', '공교', '직장', '직장', '의급'];

    rKind = partArr[pPart];
    if (rKind == 'Insu' && pCare == -1) rKind = cardArr[pCard];
    else if (rKind == 'Care') rKind = careArr[pCare];
    else if (rKind == 'Insu' && pCare != -1) rKind = careArr[pCare];
    else rKind = rKind;

    return rKind;
}

//MSSQL insert용 query
exports.insStr = function(json) {
  var strKey = '(';
  var strVal = "('";
  for(k in json) {
    strKey += k + ', ';
    strVal += json[k] + "', '";  //value는 ''로 감쌈(숫자형은 어떻게??@@@)
  }
  strKey = strKey.substring(0, strKey.length-2) + ')';
  strVal = strVal.substring(0, strVal.length-3) + ')';

  return strKey + ' VALUES ' + strVal;
}

//MSSQL update용 query
exports.updStr = function(json) {
  var strUpd = '';
  for(k in json) {
    strUpd += k + "='" + json[k] + "', ";
  }

  return strUpd.substring(0, strUpd.length-2);
}


exports.putZeros = _putZeros;
/*
exports.putZeros = function(n, digits) { //개명예정: hM_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
*/

exports.strPad = _strPad;
//exports.strPad = _strPad;

exports.OHIS = _OHIS;
exports.insStr = _getInsStr;
exports.trim = _trim;
exports.calcAge = _calcAge;
//-----------------------------------------------------------------------------
// private functions
//-----------------------------------------------------------------------------
var _getOHISNum = function(id, cb) {
  var num = Math.ceil((parseInt(id) + 390)/500) + 9;
    if ((parseInt(id) + 390)%1000 == 500) num++;
    cb(_putZeros(num, 4));
    //return _putZeros(num, 4);
}

function _OHIS(id) {
  var num = Math.ceil((parseInt(id) + 390)/500) + 9;
    if ((parseInt(id) + 390)%1000 == 500) num++;
    return _putZeros(num, 4);
}

//MSSQL insert용 query
function _getInsStr(json) {
  var strKey = '(';
  var strVal = "('";
  for(k in json) {
    strKey += k + ', ';
    strVal += json[k] + "', '";  //value는 ''로 감쌈(숫자형은 어떻게??@@@)
  }
  strKey = strKey.substring(0, strKey.length-2) + ')';
  strVal = strVal.substring(0, strVal.length-3) + ')';

  return strKey + ' VALUES ' + strVal;
}

//MSSQL update용 query
function _getUpdStr(json) {
  var strUpd = '';
  for(k in json) {
    strUpd += k + "='" + json[k] + "', ";
  }

  return strUpd.substring(0, strUpd.length-2);
}

//기능: 숫자 n 앞에 'digits 개수 - n의 자리수'개의 '0'을 놓음
//참고: 반대 기능은 parseInt(N) / parseFloat(N)로 구현하면 됨 [ex: N = "000124"]
//var _putZeros = function(n, digits) { //개명예정: hM_padZero
function _putZeros(n, digits) { //개명예정: hM_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

//opts = {"ori":"", type":"","chr":"", "len"} //type: "PAD_LEFT", "PAD_RIGHT"
function _strPad(opts) {
  var type = opts.type || 'PAD_LEFT';
  var chr = opts.chr || '0';
  var len = opts.len || 2;
  var ori = opts.ori || '';

  ori = ori.toString();
  var pStr = '';
  if (ori.length < len) {
    for (i = 0; i < len - ori.length; i++)
      pStr += chr;
  }

  if (type == 'PAD_LEFT') {
    return pStr + ori;
  } else {
    return ori + pStr;
  }

}


function _insuType(pPart, pCare, pCard) {  //Kind of Health Insurance Card
//insuKind = _insuType(0, 2, 5-4201472332);
    pCare = pCare - 1;
    pCard = substr(pCard, 0, 1) - 1;

    partArr = {'1':'일반', '2':'Insu', '5':'Care', '7':'자보'};
    careArr = ['보호1', '보호2', '#3', '#4', '차상위1', '차상위2', '차2장', '2장', '#9'];
    cardArr = ['지역', '지역', '지역', '지역', '공교', '공교', '직장', '직장', '의급'];

    rKind = partArr[pPart];
    if (rKind == 'Insu' && pCare == -1) rKind = cardArr[pCard];
    else if (rKind == 'Care') rKind = careArr[pCare];
    else if (rKind == 'Insu' && pCare != -1) rKind = careArr[pCare];
    //else rKind = rKind;

    return rKind;
}

//jumin: yymmddA 예) 6705061 (주민번호: 670506-1******)
function _calcAge(jumin) {
  var v1 = Number(jumin.substr(0,2));
  var v2 = Number(jumin.substr(6,1));
  var vy = (v2==1 || v2==2 || v2==5 || v2==6) ? 1900 +v1 : ((v2==3 || v2==4 || v2==7 || v2==8) ? 2000 +v1 : 0);
  var vm = Number(jumin.substr(2,2));
  var vd = Number(jumin.substr(4,2));

  var today = new Date();
  var thisYear = today.getFullYear();
  var thisMonth = today.getMonth()+1; // Date 를 사용할때 getMonth 는 0 이 1월이므로 1을 더한다
  var thisDay = today.getDate();
  var dy = thisYear - vy; // 년차
  var dmd = (thisMonth - vm) *100 + (thisDay - vd); // 단순 비교이므로, 월에 30을 곱할 필요 없음
  //console.log('thisYear, thisMonth, thisDay, vy, vm, vd', thisYear, thisMonth, thisDay, vy, vm, vd)
  return dmd >= 0 ? dy -1 : dy; // 생일이 지나지 않았으면 년차에서 1년을 제하고, 지났으면 년차값이 만 나이
}

//jumin: yymmddA 예) 6705061 (주민번호: 670506-1******)
function _calcSex(jumin) {
 var nSex = Number(jumin.substring(6,7));
 if (nSex % 2 == 1)
　　return "남";
 else
　　return "여";
}


//기능: str trim
function _trim(str) {
  return str.replace(/(^\s*)|(\s*$)/gi, "");
}