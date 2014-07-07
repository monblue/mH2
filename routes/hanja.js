////////////////////////////////////////////////
// hanja.js
var fs = require('fs');
var ckmap = ('./CKMAP');

var patternK = /[\uac00-\ud7af]+/g;
var patternC = /[\u2FF0-\u2FFF\u31C0-\u31EF\u3400-\u4DBF\u4E00-\u9FBF\uF900-\uFAFF\u20000-\u2A6DF\u2F800-\u2FA1F]+/g;
var separator = '`';  //한자 중복 변환 방지용 분리자@@@@

var string = ' 東海물과 白頭山이 마르고 닳도록 하느님이 保佑하사 우리나라 만세 東海물과 白頭山이 마르고 닳도록 하느님이 保佑하사 우리나라 만세 東海白頭山 같은 경우는 어떻게';


var convMap = {
  "東":"동", "海":"해", "白":"백", "頭":"두", "山":"산", "保":"보", "佑":"우"
}

/*
//var file = __dirname + '/test.json';
var file = __dirname + '/CKMAP.json';

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  data = JSON.parse(data);

  console.dir(data);
});
*/

//var convMap = ckmap.CKMAP;
//ckmap.temp();

//console.log('convMap', convMap);
//console.log('ckmap.temp', ckmap.temp);
/*
app.get('/convK2C', function(req, res) {
  var srch = string.match('/[' + patternC + ']+/u');
  console.log('convK2C', srch);
	res.send(srch);
});
*/

exports.convK2C = function(req, res) {
  /*
  var srch = string.match(patternC);
  console.log('convK2C', srch);
  arrChange = _getChange(_arrayUnique(srch));
  */
  //var string =
  var rs = _convK2C({"origin":string, type:'kc'});
  //res.send(_arrayUnique(srch));
  res.send(rs);
}

//두음법칙, 다음어독음, 독음예외(불, 부, ...)
//띄어쓰기, 페이지 구분으로 분리된 글자 처리(예: 음양 오행)
var _convK2C = function(opts) {
  var origin = opts.origin || '테스트';
  var type = opts.type || 'kc';
  var head = opts.head || '(';
  var tail = opts.tail || ')';

  //var srch = _arrayUnique(origin.match(patternC));
  var srch = _getPattern(origin);
  var repl = _getChange(srch);
  var patK;

  for (var i=0; i < srch.length; i++) {
    patK = _modifyPattern(srch[i]); //@@@한자사이에 '``' 넣기
    switch(type) {
    case 'kc':
      replace = repl[i] + head + patK + tail;
      break;
    case 'ck':
      replace = srch[i] + head + patK + tail;
      break;
    }

    sChar = new RegExp(srch[i], 'g');
    console.log(replace);
    //pat = pat.replace(sChar, '\\' + arrChar[i]);
    origin = origin.replace(sChar, replace);
  }

  return origin.replace(new RegExp(separator, 'g'), '');
}

//단순 변환, 분리자 포함 변환(다른 pattern을 일부로 포함하는 pattern)@@@
var _getPattern = function(string) {
  var pattern = _arrayUnique(string.match(patternC));
  pattern.sort(function(a,b){
    return b.length - a.length;
  });
  console.log(' pattern',  pattern);
  return pattern;
}

var _getChange = function(array) {
  //var convMap = ;
  var patK;
  var change = [];
  console.log('array', array);
  for (var i=0; i < array.length; i++){
    patK = array[i];
    temp = '';
    for (var j=0; j < patK.length; j++){
      temp += convMap[patK.substr(j, 1)];
    }
    change.push(temp);
  }
  return change;
}


var _modifyPattern = function(string) {
  var temp = '';
  for (var i=0; i < string.length; i++){
    temp += string.substr(i, 1) + separator;
  }
  return temp;
}

var _arrayUnique = function(array) {
  var a = {};
  for(var i=0; i <array.length; i++){
    if(typeof a[array[i]] == "undefined")
      a[array[i]] = 1;
  }
  array.length = 0;
  for(var i in a)
    array[array.length] = i;
  return array;
}