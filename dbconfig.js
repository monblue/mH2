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
/*

      mssql.connect(mssqlconfig, function(err) {
        var request = new mssql.Request();
        request.query(que, function(err, recordset) {
          callback(err, recordset);
        });
      });
*/
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
//module.exports = dbconfig;