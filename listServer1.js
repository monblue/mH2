////////////////////////////////////////////////
// listServer.js
var express = require('express');
var path = require('path');
var http = require('http');
//var fs = require('fs');
//var async = require('async');
//var test1 = require('./routes/mssqlApi');
var events = require("events");

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 4545);
    app.use(express.logger('dev'));  // 'default', 'short', 'tiny', 'dev'
    app.use(express.bodyParser());
    //app.use(express.static(path.join(__dirname, 'public')));
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

////----------------------------------------------------------------------------
//Event Emitter
var event = new events.EventEmitter();

////----------------------------------------------------------------------------
//MSSQL
var mssql = require('mssql');
//var request = new mssql.Request();

//require 시켜야 하지 않나? dbconfig.js로
var mssqlconfig = {
    user: 'haniMS',
    password: 'MShani',
    server: '192.168.0.11\\hanimacCS2', // You can use 'localhost\\instance' to connect to named instance
    database: 'hanimacCS',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

////----------------------------------------------------------------------------
//MongoDB
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

////----------------------------------------------------------------------------



// Enabling Cross Domain @@@@@@@added by Moon(ref: https://github.com/fernandoperigolo/nodejs-crud/blob/master/app.js)
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


////router
app.get('/pt/:date', function(req, res) {
  _readMSData(req, res);
});

/*
////sync mongodb - mssql - backbone
기준: mongodb
동기화 방법: event emit
backbone -> mongodb
mongodb -> backbone : syncMGBB (socket.io)
mongodb -> mssql : create, update(동기화 필요없는 경우도 있음[saved, charted, ...])
mssql -> mongodb : syncMSMG

*/

//Create
app.post('/txRecords', function(req, res) {
	//_mgCreateRs(req, res, {col:'txRecord'});
	console.log('Create txRecord', req.body);
	//event.emit("created");
	//req.end();
});

//ReadAll
app.get('/txRecords', function(req, res) {
	_mgReadAllRs(req, res, {col:'txRecord'});
});

//ReadOne
app.get('/txRecords/:id', function(req, res) {
	_mgReadOneRs(req, res, {col:'txRecord'});
});

//Update
app.put('/txRecords/:id', function(req, res) {
//app.put('/txRecords', function(req, res) {
	console.log('update txRecord', req.params.id);
	_mgUpdateRs(req, res, {col:'txRecord'});
	//req.end('update txRecord');
});

//Delete
app.delete('/txRecords/:id', function(req, res) {
//app.put('/txRecords', function(req, res) {
	console.log('delete txRecord', req.params.id);
	_mgDeleteRs(req, res, {col:'txRecord'});
	//req.end('delete txRecord');
});


//find(readque)
app.post('/findTxRecord', function(req, res) {
//app.put('/txRecords', function(req, res) {
	console.log('find txRecord', req.body.que);
	_mgFindRs(req, res, {col:'txRecord'});
	//req.end('patch txRecord');
});

/*
//Post test@@@@@@
app.post('/txRecords/:id', function(req, res) {
	console.log('Post test txRecord', req.params.id);
	req.end();
	//_mgUpdateRs(req, res, {col:'txRecord'});
	//req.end('Post test txRecord');
});
*/

//Patch
app.patch('/txRecords/:id', function(req, res) {
//app.put('/txRecords', function(req, res) {
	console.log('patch txRecord', req.params.id);
	_mgPatchRs(req, res, {col:'txRecord'});
	//req.end('patch txRecord');
});


////===========================================================================
//// app function
////===========================================================================
//-----------------------------------------------------------------------------
// CRUD for Patient
//-----------------------------------------------------------------------------
/**
 * READ patients
 * @caution: !!!$date param, sync MSSQL -> mysql
 * @param  string  $date
 * @return echo json
 */
app.get('/patients/:date', function(req, res) {
  var date = req.params.date;
  var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  //console.log('table, jdate', table, jdate);
  var que = "select * from " + table + " where JUBM_DATE = '" + jdate + "'";

	_msQueryRs(req, res, {"que":que});

});

/*
function getPatients($date) {
  $sql = "SELECT * FROM `patient_$date` ORDER BY name";
  echo json_encode(mH_selectArrayMYSQL($sql));
}








//-----------------------------------------------------------------------------
// CRUD for Patient
//-----------------------------------------------------------------------------
$app->get('/patients/:date', 'getPatients');
$app->get('/patients/:date/:id', 'getPatient');
$app->post('/patients/:date', 'addPatient');
$app->post('/patients/:date/:id', 'addPatient');  //forced POST
$app->patch('/patients/:date/:id', 'updatePatient');
$app->put('/patients/:date/:id', 'updatePatient');
$app->delete('/patients/:date/:id',  'deletePatient');
$app->get('/patients/search/:query', 'findByName');
//-----------------------------------------------------------------------------
// Accessory
//-----------------------------------------------------------------------------
$app->get('/hereIam', 'hereIam');

$app->get('/createPatientTable/:date', 'createPatientTable');

$app->get('/syncPatientsMSMY/:date', 'syncPatientsMSMY');

$app->post('/searchPatient', 'searchPatientMS'); //환자 검색(in 전체 DB)

$app->post('/getUser', 'getUser'); //사용자 정보

//timer
$app->post('/saveTimer/:date/:id', 'saveTimer');
$app->get('/getInterval/:time', 'getInterval');


  $sql = "SELECT
          cham.CHAM_ID AS CHARTID,
          cham.CHAM_CHARTNUM AS chartNum,
          cham.CHAM_JEJU AS JEJUCODE,
          cham.CHAM_WHANJA AS NAME,
          cham.CHAM_SEX AS SEX,
          substring(cham.CHAM_PASSWORD, 1, 6) AS jumin01,
          hanimacCS.dbo.UF_getAge3(cham.CHAM_PASSWORD, convert(char(8), Getdate(), 112)) AS AGE,
          cham.CHAM_YY AS yy,
          cham.CHAM_PART AS PART,
          cham.CHAM_DAE AS DAE,
          cham.CHAM_JEUNG AS JEUNG,
          cham.CHAM_TEL AS telNum,
          cham.CHAM_HP AS hpNum,
          cham.CHAM_BOHOJA AS bohoja,
          cast(cham.CHAM_MEMO AS text) AS memo,
          cham.CHAM_읍면동명 AS ADDRESS2,
          jubm.JUBM_JUBSU_TIME AS JTIME,
          jubm.JUBM_GICHO1 AS KSTATE,
          substring(jubm.JUBM_GICHO2, 1, 2) AS BNUM,
          substring(jubm.JUBM_GICHO2, 3, 4) AS BTIME,
          jubm.JUBM_IRAMT AS BONBU,
          jubm.JUBM_MTAMT AS TOTAL,
          jubm.JUBM_BIGUB AS BIBO,
          jubm.JUBM_TODAY AS ORDER1,
          swam.SWAM_DATE AS FIRSTDATE,
          kwam.KWAM_DATE AS LASTDATE,
          kwam.KWAM_DATE_AF AS LASTDATE2,
          datediff(day, kwam.KWAM_DATE, convert(char(8), Getdate(), 112)) AS LAST,
          datediff(day, kwam.KWAM_DATE_AF, convert(char(8), Getdate(), 112)) AS LAST2,
          post.POST_NAME1 + ' ' + post.POST_NAME2 + ' ' + post.POST_NAME3 + ' ' + cham.CHAM_JUSO AS ADDRESS
          FROM hanimacCS.dbo.CC_CHAM AS cham
          INNER JOIN  Month.dbo.JUBM$month AS jubm ON cham.CHAM_ID = jubm.JUBM_CHAM_ID
          LEFT OUTER JOIN  hanimacCS.dbo.CC_KWAM AS kwam ON cham.CHAM_ID = kwam.KWAM_CHAM_ID
          LEFT OUTER JOIN  hanimacCS.dbo.CC_SWAM AS swam ON cham.CHAM_ID = swam.SWAM_CHAM_ID
          LEFT OUTER JOIN  hanimacCS.dbo.CC_POST AS post ON cham.CHAM_POST = post.POST_KEY
          WHERE jubm.JUBM_DATE = '$date_'
          ORDER BY jubm.JUBM_JUBSU_TIME DESC";


*/




/*
////functions
//[ref](http://nodeqa.com/nodejs_ref/3)
var _readMSData = function(req, res) {
  var date = req.params.date;
  var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  //console.log('table, jdate', table, jdate);
  var que = "select * from " + table + " where JUBM_DATE = '" + jdate + "'";

  async.parallel([
    // 다음 task으로 이동하기 위해서는 callback을 실행해야하고,
    // 사용방법은 callback(에러, 결과값[, 결과값#2...]) 형태로 사용됩니다.
    function(callback) {
      setTimeout(function(){
        console.log('--- async.parallel::step#2 ---');
        // 다음 task으로 이동하기 위해 callback 실행
        // two값 전달
        callback(null, 'two');
      }, 100);
    },

    function(callback) {
      mssql.connect(mssqlconfig, function(err) {
        var request = new mssql.Request();
        request.query(que, function(err, recordset) {
          callback(err, recordset);
        });
      });
    },
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    //console.log(arguments);
    console.log(arguments);
    res.send(results[1]);
    //console.log(results[1]);
  });

}
*/



event.on("created", function () {
	console.log('event created emitted');
  for (var i = 0; i <= 10; i++) {
    console.log("I do my work " + i);
  }
  //event.emit("done");
});





//Response MSSQL Query res.send Json
var _msQueryRs = function(req, res, opts) {
	//var dbconfig = opts.dbconfig || mssqlconfig;
	var que = opts.que || '';
	mssql.connect(mssqlconfig, function(err) {
	  var request = new mssql.Request();
	  request.query(que, function(err, recordset) {
	    res.send(recordset);
	    res.end();
	  });
	});
}





var _mgCreateRs = function(req, res, opts) {
	var col = opts.collection || 'txRecord';
  var item = req.body;
  console.log('Retrieving item: ', req.body);
  /*
  mgdb.collection(col, function(err, collection) {
    collection.insert(item, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
*/
};

var _mgReadAllRs = function(req, res, opts) {
	var col = opts.collection || 'txRecord';
  mgdb.collection(col, function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
}


var _mgReadOneRs = function(req, res, opts) {
	var col = opts.collection || 'txRecord';
  var id = req.params.id;
  //console.log('Retrieving item: ' + id);
  mgdb.collection(col, function(err, collection) {
    //collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
    collection.findOne({'id':id}, function(err, item) {
      res.send(item);
    });
  });
};

var _mgUpdateRs = function(req, res, opts) {

  var id = req.params.id;
	var col = opts.collection || 'txRecord';
  var item = req.body;

  mgdb.collection(col, function(err, collection) {
    collection.update({'id':id}, item, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating item: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(item);
      }
    });

  });

}


var _mgDeleteRs = function(req, res, opts) {

  var id = req.params.id;
	var col = opts.collection || 'txRecord';
  //var item = req.body;
  //delete item._id;
  //console.log('Updating item: ' + id);
  //console.log(JSON.stringify(item));
  mgdb.collection(col, function(err, collection) {
  	//res.send('update');

    //collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
    collection.remove({'id':id}, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating item: ' + err);
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });

  });

}


var _mgFindRs = function(req, res, opts) {
	var col = opts.collection || 'txRecord';
  var que = req.body.que;

  //var filter = new RegExp(req.query.keyword, '');
  //collection.find({$or:[{_t:{$elemMatch:{t:filter}}},{_t:filter},{_o:filter}]}, {_t:1}).toArray(function(err, docs) {

  console.log('find query ', que);
  mgdb.collection(col, function(err, collection) {
    collection.find(que).toArray(function(err, items) {
    //collection.find({name:/고/}).toArray(function(err, items) {
      res.send(items);
    });
  });
};


var _mgPatchRs = function(req, res, opts) {

  var id = req.params.id;
	var col = opts.collection || 'txRecord';
  var item = req.body;

  mgdb.collection(col, function(err, collection) {
    collection.update({'id':id}, { $set: item }, {safe:true}, function(err, result) {
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



//Return Json
var _msQueryRt = function(req, res, opts) {
	var que = opts.que || '';

  async.parallel([
    // 다음 task으로 이동하기 위해서는 callback을 실행해야하고,
    // 사용방법은 callback(에러, 결과값[, 결과값#2...]) 형태로 사용됩니다.
    function(callback) {
      setTimeout(function(){
        console.log('--- async.parallel::step#2 ---');
        // 다음 task으로 이동하기 위해 callback 실행
        // two값 전달
        callback(null, 'two');
      }, 100);
    },

    function(callback) {
      mssql.connect(mssqlconfig, function(err) {
        var request = new mssql.Request();
        request.query(que, function(err, recordset) {
          callback(err, recordset);
        });
      });
    },
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    //console.log(arguments);
    //res.send(results[1]);
    return results[1];
    //console.log(results[1]);
  });

}


/*
////functions
//[ref](http://nodeqa.com/nodejs_ref/3)
var _readMSData = function(req, res) {
  var date = req.params.date;
  var table = 'Month.dbo.JUBM' + date.substring(0,6);
  var jdate = date.substring(6,8);
  //console.log('table, jdate', table, jdate);
  var que = "select * from " + table + " where JUBM_DATE = '" + jdate + "'";

  async.parallel([
    function(callback) {
      setTimeout(function(){
        console.log('--- async.parallel::step#2 ---');
        // 다음 task으로 이동하기 위해 callback 실행
        // two값 전달
        callback(null, 'two');
      }, 100);
    },

    function(callback) {
      mssql.connect(mssqlconfig, function(err) {
        var request = new mssql.Request();
        request.query(que, function(err, recordset) {
          callback(err, recordset);
        });
      });
    },
  ],

  // 모든 task를 끝내고, 아래 callback으로 에러와 배열인자가 전달됩니다.
  function(err, results) {
    console.log(arguments);
    res.send(results[1]);
  });

}
*/