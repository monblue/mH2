//apiServer.js
var express = require('express');
var bodyParser = require('body-parser');  //npm install --save body-parser
var path = require('path');
var list = require('./routes/list');
var test = require('./routes/test');
var hanja = require('./routes/hanja');
var upload = require('./routes/upload');
//var chart = require('./routes/chart');
//var user = require('./routes/user');
//var book = require('./routes/book');

var app = express();
app.set('port', process.env.PORT || 3333);
app.use(bodyParser()); // instruct the app to use the `bodyParser()` middleware for all routes

var server = app.listen(app.get('port'), function() {

});

//-----------------------------------------------------------------------------
// Route
//-----------------------------------------------------------------------------
//// [Enabling Cross Domain](ref: https://github.com/fernandoperigolo/nodejs-crud/blob/master/app.js)
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//// list
/// patients : Basic CRUD
app.post('/patients/:date', list.createPatients);  //Create
app.get('/patients/:date', list.readAllPatients);  //ReadAll
app.get('/patients/:date/:id', list.readOnePatient);  //ReadOne
app.put('/patients/:date/:id', list.updatePatient);  //Update
app.delete('/patients/:date/:id', list.deletePatient);  //Delete
/*
/// patients : Extra
app.post('/findPt/:date', list.createPatients);  //Find by Query
//app.post('/patients/:date/:id', list.createPatient);  //forced Post
app.patch('/patients/:date/:id', list.createPatients);  //Patch
*/
app.patch('/patients/:date/:id', list.patchPatient);  //Update[Patch]


app.get('/syncPatientsMSMG/:date', list.syncPatientsMSMG);  //ReadOne

app.post('/searchPatients', list.searchPatients);  //search Patients post:{'name':'','tel':'','jumin':''}


//app.post('/getUser', list.getUser); //사용자 정보

//timer
app.post('/saveTimer/:date/:id', list.saveTimer);
//app.get('/saveTimer/:date/:id', list.saveTimer);
app.get('/getInterval/:time', list.getInterval);

/*
app.get('/hereIam', 'hereIam');

app.get('/createPatientTable/:date', 'createPatientTable');
app.get('/syncPatientsMSMY/:date', 'syncPatientsMSMY');
app.post('/searchPatient', 'searchPatientMS'); //환자 검색(in 전체 DB)
app.post('/getUser', 'getUser'); //사용자 정보

//timer
app.post('/saveTimer/:date/:id', 'saveTimer');
app.get('/getInterval/:time', 'getInterval');
*/

////test
app.post('/test', test.compareJson);  //ReadAll
app.get('/hanja', hanja.convK2C);  //ReadAll

app.get('/temp', test.temp);  //ReadAll
app.get('/var1', function(req,res){console.log(test.var1)});  //ReadAll


//app.get('/saveFace/:id', upload.saveFile);
app.post('/saveFace/:id', upload.saveFile);