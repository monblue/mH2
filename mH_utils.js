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
  //collection.find({$or:[{_t:{$elemMatch:{t:filter}}},{_t:filter},{_o:filter}]}, {_t:1}).toArray(function(err, docs) {

  console.log('find query ', que);
  mgdb.collection(opts.col, function(err, collection) {
    collection.find(que).toArray(function(err, rs) {
      res.send(rs);
    });
  });
};


exports.mgPatchRs = function(opts, cb) {
  var id = opts.id;
  var item = opts.body;

  mgdb.collection(opts.col, function(err, collection) {
    collection.update({'id':id}, { $set: item }, {safe:true}, function(err, rs) {
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



exports.OHISNum = _getOHISNum;




//-----------------------------------------------------------------------------
// private functions
//-----------------------------------------------------------------------------
var _getOHISNum = function(id, cb) {
  var num = Math.ceil((parseInt(id) + 390)/500) + 9;
    if ((parseInt(id) + 390)%1000 == 500) num++;
    cb(_putZeros(num, 4));
    //return _putZeros(num, 4);
}



//기능: 숫자 n 앞에 'digits 개수 - n의 자리수'개의 '0'을 놓음
//참고: 반대 기능은 parseInt(N) / parseFloat(N)로 구현하면 됨 [ex: N = "000124"]
var _putZeros = function(n, digits) { //개명예정: hM_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}