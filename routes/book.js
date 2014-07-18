////////////////////////////////////////////////
// bookFile.js

var BOOKDIR = 'd:/dev/mH2/file/'; //상수 config에 등록할 것@@@@@@@@@
//-----------------------------------------------------------------------------
// require
//-----------------------------------------------------------------------------
/*
var express = require('express');
var bodyParser = require('body-parser');  //npm install --save body-parser
var path = require('path');
var http = require('http');
var fs = require('fs');
var mongo = require('mongodb');
*/
var mH_utils = require('../mH_utils');
var fs = require('fs');
var async = require('async');
//var dateFormat = require('dateformat');
var _ = require('underscore');


/**
 *
 * @caution:
 * @param   object  date
 * @return  string  date[YYYYmmdd]
 */
exports.viewPage = function(req, res) {
  var p = _getPageSE({"book":req.params.book, "page":req.params.page});
  console.log('file', p);

  fs.readFile(p.file, 'utf8', function(err, data) {
  //fs.readFile('d:/dev/mH2/file/yanghan.txt', 'utf8', function(err, data) {
    if (err) console.log('err!!!');
    //console.log(data);
    res.send(data.substring(data.search(p.sPage), data.search(p.ePage) + p.zpad + 1));
    res.end();
  });
}


exports.replaceOne = function(req, res) {
  var book = req.params.book;
  var pat = req.body.pattern;
  var rep = req.body.replace;
  var isRegex = parseInt(req.body.isRegex);
  var file = BOOKDIR + book + '.txt'

  var opts = {
    "pat":pat,
    "rep":rep,
    "isRegex":isRegex,
    //"book":book,
    "file":file
  }

  _replaceOne(opts, function(content) {
  //_replaceOne(opts, function(content, pat2) { //@@@@@@@@@@
    fs.writeFile(file, content, function(err) {
      if (err) throw err;
      console.log('File write completed');
      //var data = {'o':pat, 'r':rep, 'e':isRegex, 'b':book};
      var data = {'o':pat, 'r':rep, 'e':isRegex, 'b':book};
      //db에 저장
      mH_utils.mgCreateRs({"col":"bookEdit", "body":data}, function(err, rs){
        console.log('insert success');
        res.send(rs);
      });
    });
  });

}

//mongodb에 저장된 편집(수정) 패턴에 따라 파일을 일괄 변경@@@
//0. readFile / 1. get replace data(mongodb) / 2. replace loop / 3. writeFile
exports.replaceAll = function(req, res) {
  var book = req.params.book;
  var file = BOOKDIR + book + '.txt';

  console.log('file', file);

  fs.readFile(file, {encoding: 'utf-8'}, function(err, data) {
    //var content = data;
    async.waterfall([
      function(callback) {
        //db.bookEdit.find().sort({_id:1})
        //db.bookEdit.find({$query:{}, $orderby:{_id:1}})
        var filter = {$query:{}, $orderby:{_id:1}}; //_id 오름차순으로...@@@@
        mH_utils.mgReadAllRs({"col":"bookEdit", "filter":filter}, function(err, rs) {
          console.log('bookEdit rs', rs);
          callback(err, rs);
        });
      },

      function(rs, callback) {
        console.log('rs', rs);
        async.each(rs, function(r, cb) {
          pat = r.o;
          //정규식일 경우 구분할 필요는?
          console.log('pat1', pat);
/*
          if (!r.e) {
            pat = pat.replace("\\", "\\\\");
          }
*/
          //pat = new RegExp(pat, 'g');
          pat = _setPattern(pat, r.o)
          console.log('pat2', pat);
          data = data.replace(pat, r.r);
          cb();
        }, function(err) {
          //console.log('foreach rs', rs);
          callback(err, rs);  //each가 완료된 후 callback함수로 err, rs 넘김
        });
      },

    ],

    function(err, results) {
      //console.log(arguments);
      //console.log(results);
      fs.writeFile(file, data, function(err) {
        if(err) throw err;
        console.log('file edit success');
        res.end();
      });
      //res.send(results);
    });
  });
}


exports.savePage = function(req, res) {
  console.log('savePage', req.body.tPage);

  var p = _getPageSE({"book":req.params.book, "page":req.params.page});

  var content = fs.readFileSync(p.file, 'utf8');
  var prevPages = content.substring(0, content.search(p.sPage));
  //var nextPages = content.substring(content.search(p.ePage) + p.zpad + 2, content.length);
  var nextPages = content.substring(content.search(p.ePage) + p.zpad + 1, content.length);
  //var content = prevPages + req.body.tPage + nextPages;

    fs.writeFile(p.file, prevPages + req.body.tPage + nextPages, function(err) {
      if(err) throw err;
      console.log('File write completed');
      res.end();
    });

}



/*
app.get('/replaceAll/:book', function(req, res) {
  var book = req.params.book;
  var file = './file/' + book + '.txt'

  console.log('pattern replace ', pat, rep, isRegex);

  //async.waterfall
  //0. readFile / 1. get replace data(mongodb) / 2. replace loop / 3. writeFile
  fs.readFile(file, {encoding: 'utf-8'}, function(err, data){
    async.waterfall([
      function(callback) {
        mH_utils.msQueryRs({"que":que}, function(err, rs){
          //res.send(rs);
          callback(err, rs);
          //callback(rs);
        });
      },

      function(rs, callback) {
        async.each(rs, function(r, cb) {  //The second argument (callback) is the "task callback" for a specific r
          r.ITYPE = mH_utils.insuType(r.PART, r.DAE, r.JEUNG); //보험 타입

          _getPatientPhotoMS({"id":r.CHARTID}, function(err, rs2){
            r.PIC = rs2;
            cb(); //잘 모르겠지만 여기 넣으니 되네@@@@@@@@@
          });

        }, function(err) {
          //console.log('foreach rs', rs);
          callback(err, rs);  //each가 완료된 후 callback함수로 err, rs 넘김
        });

      },

    ],

    function(err, results) {
      //console.log(arguments);
      console.log(results);
      res.send(results);
      //cb(err, results);
    });
  });

});
*/




var _getPageSE = function(opts) {
  var book = opts.book || 'donggam';
  var page = opts.page || 1;
  var zpad = opts.zpad || 3;
  var pageTag = opts.pageTag || '`';
  //var file = './file/' + opts.book + '.txt';
  var file = BOOKDIR + opts.book + '.txt';

  if (book == 'donggam') {
    zpad = 4;
    pageTag = '#';
  }

  var sPage = pageTag + mH_utils.putZeros(page, zpad);
  var ePage = pageTag + mH_utils.putZeros(parseInt(page) + 1, zpad);

  return {"file":file, "zpad":zpad, "sPage":sPage, "ePage":ePage};
}


//replaceOne returning version
//replaceOne callback version
var _replaceOne = function(opts, callback) {
  var pat = opts.pat;
  var rep = opts.rep;
  var isRegex = opts.isRegex || 0;
  var file = opts.file;
  //var data = {'o':pat, 'r':rep, 'e':isRegex, 'b':book};
  pat = _setPattern(pat, isRegex);

  var content = fs.readFileSync(file, 'utf8');
  content = content.replace(pat, rep);

  //callback(content, pat);
  callback(content);
  //return content;

}


//pattern(수정 대상 string) 변경
function _setPattern(pat, isRegex) {

    if (!isRegex) {
    //특수문자 escape000000
    //pat = pat.replace(/(\^|\.|\,|\(|\)|\[|\]|\$|\*|\-)/g, '\\$1');
    var arrChar = ['\\^', '\\.', '\\,', '\\*', '\\+', '\\-', '\\[', '\\]', '\\(', '\\)', '\\?', '\\|'];
    var len=arrChar.length;
    for (i=0;i<len;i++) {
      sChar = new RegExp(arrChar[i], 'g');
      //pat = pat.replace(sChar, '\\' + arrChar[i]);
      pat = pat.replace(sChar, arrChar[i]);
      console.log('sChar, sRep', sChar, '\\' + arrChar[i]);
      //console.log('sChar, sRep', sChar, '\\' + arrChar[i].substring(1, arrChar[i].length));
    }
    //pat = pat.replace(/(\^)/g, '\\$1');
    console.log('pat', pat);
  } else {
    console.log('pattern', pat);
  }

  return new RegExp(pat, 'g');
}


/*
D:\apps\mongoDB>mongo
> use bookdb
> db.bookEdit.find()




단어시작 표시
·
『
「
(
○
“



단어끝 표시
』
」
)
,
.
”



*/


//-----------------------------------------------------------------------------
// util functions
//-----------------------------------------------------------------------------
/*
function mH_padZero(n, digits) { //개명예정: hM_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
*/