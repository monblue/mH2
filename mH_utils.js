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

//mgdb = new MgDb('bookdb', mgserver, {safe: true});
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
//exports.mgCreateRs = function(req, res, opts) {
exports.mgCreateRs = function(opts, cb) {
	//var data = opts.data || {};
	var data = opts.body;
	//var date = opts.date || '20140628';
	data.date = opts.date || '20140628';
	var col = opts.col || 'daily';
  //var item = req.body;
  console.log('data: ' + data);
  mgdb.collection(col, function(err, collection) {
    //collection.insert(item, {safe:true}, function(err, rs) {
    collection.insert(data, {safe:true}, function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
      	cb(rs);
      }
    });

  });
};


exports.mgReadAllRs = function(opts, cb) {
	var col = opts.col || 'daily';
	var filter = opts.filter || {};
  mgdb.collection(col, function(err, collection) {
    collection.find(filter).toArray(function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
      	cb(rs);
      }
    });
  });
}


exports.mgReadOneRs = function(opts, cb) {
	var col = opts.col || 'daily';
	var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  //var id = req.params.id;
  //console.log('Retrieving item: ' + id);
  mgdb.collection(col, function(err, collection) {
    //collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
    collection.findOne(filter, function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
      	cb(rs);
      }
    });
  });
};


exports.mgReadFieldsRs = function(opts, cb) {
  var col = opts.col || 'daily';
  var filter = opts.filter || {};
  var fields = opts.fields || {};
  mgdb.collection(col, function(err, collection) {
    collection.find(filter, fields).toArray(function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
        cb(rs);
      }
    });
  });
}

exports.mgUpdateRs = function(opts, cb) {
  //var id = req.params.id;
	var col = opts.col || 'daily';
	var data = opts.body || {};
	var filter = opts.filter || {};  //filter = {"date":date, "id":id}

  mgdb.collection(col, function(err, collection) {
    collection.update(filter, data, {safe:true}, function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
      	cb(rs);
      }
    });

  });

}


exports.mgDeleteRs = function(opts, cb) {
	var col = opts.col || 'daily';
	var data = opts.body || {};
	var filter = opts.filter || {};  //filter = {"date":date, "id":id}
  mgdb.collection(col, function(err, collection) {
    collection.remove(filter, {safe:true}, function(err, rs) {
      if (err) {
        cb({'error':'An error has occurred'});
      } else {
      	cb(rs);
      }
    });

  });

}


exports.mgFindRs = function(req, res, opts) {
	var col = opts.col || 'daily';
  var que = req.body.que;

  //var filter = new RegExp(req.query.keyword, '');
  //collection.find({$or:[{_t:{$elemMatch:{t:filter}}},{_t:filter},{_o:filter}]}, {_t:1}).toArray(function(err, docs) {

  console.log('find query ', que);
  mgdb.collection(col, function(err, collection) {
    collection.find(que).toArray(function(err, rs) {
    	//collection.find({name:/고/}).toArray(function(err, rs) {
      res.send(rs);
    });
  });
};


exports.mgPatchRs = function(req, res, opts) {

  var id = req.params.id;
	var col = opts.col || 'daily';
  var item = req.body;

  mgdb.collection(col, function(err, collection) {
    collection.update({'id':id}, { $set: item }, {safe:true}, function(err, rs) {
      if (err) {
        console.log('Error patching item: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) patched');
        res.send(item);
      }
    });

  });

}



//-----------------------------------------------------------------------------
// exports:: MSSQL CRUD functions
//-----------------------------------------------------------------------------
exports.msQueryRs = function(opts, cb) {
	var que = opts.que || '';
	mssql.connect(mssqlconfig, function(err) {
	  var request = new mssql.Request();
	  request.query(que, function(err, rs) {
	    cb(rs);
	    //res.end();
	  });
	});

}







//-----------------------------------------------------------------------------
// exports
//-----------------------------------------------------------------------------
//module.exports = mH_utils;





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
	var key = opts.key || 'id';
  var key = key || 'id';  //primary key(uniq)

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

  cb({"add":arrAdd, "del":arrDel, "upd":arrUpd});
  //return {add:arrAdd, del:arrDel, upd:arrUpd};
}


exports.OHISNum = _getOHISNum;


var _getOHISNum = function(id) {
  var num = Math.ceil((parseInt(id) + 390)/500) + 9;
    if (((parseInt(id) + 390)%1000 == 500) num++;
    return _putZeros(num, 4);
    //return str_pad($OHISNum, 4, "0", STR_PAD_LEFT);
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