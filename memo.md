## server & port
### webServer : 80 / 9999
* node webServer

### apiServer : 3333 / 4444
* node apiServer

### blogServer : 3000 / 4000

### mongodb : 27017

### mssql : 1433

-------------------------------------------------------------------------------

## boilerplate

### webserver[express4]: 1file
* 실행: node app.js
```
var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3333);
var server = app.listen(app.get('port'), function() {

});
```



### webserver[express4] : 2files, only server(/bin/mh + /app.js)
* 실행: node bin/mh

1. most simple
#### /bin/mh
```
var app = require('../app');
app.set('port', process.env.PORT || 3333);
var server = app.listen(app.get('port'), function() {

});
```

#### /app.js
```
var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;
```

2. +debug
#### /bin/mh
```
var debug = require('debug')('mH2');
var app = require('../app2');

app.set('port', process.env.PORT || 3333);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
```

3. +favicon, error, parser, route, view engine
#### /app.js
```
//-----------------------------------------------------------------------------
// require
//-----------------------------------------------------------------------------
//// npm libraries
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//// user libraries
var routes = require('./routes/index');
var users = require('./routes/users');

//-----------------------------------------------------------------------------
// instantiate
//-----------------------------------------------------------------------------
var app = express();

//// view engine setup
// layout 사용 시
var engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// layout 미사용 시
//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//-----------------------------------------------------------------------------
// route
//-----------------------------------------------------------------------------
app.use('/', routes);
app.use('/users', users);

//-----------------------------------------------------------------------------
// handlers
//-----------------------------------------------------------------------------
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//-----------------------------------------------------------------------------
// exports
//-----------------------------------------------------------------------------
module.exports = app;
```



#### database config
* dbconfig.js

```
//-----------------------------------------------------------------------------
// MSSQL
//-----------------------------------------------------------------------------
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


      mssql.connect(mssqlconfig, function(err) {
        var request = new mssql.Request();
        request.query(que, function(err, recordset) {
          callback(err, recordset);
        });
      });

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
// exports
//-----------------------------------------------------------------------------
module.exports = dbconfig;