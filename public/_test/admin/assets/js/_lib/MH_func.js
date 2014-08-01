////----------------------------------------------------------
////string, date 등 관련 함수
////----------------------------------------------------------

//기능: 숫자 n 앞에 'digits 개수 - n의 자리수'개의 '0'을 놓음
//참고: 반대 기능은 parseInt(N) / parseFloat(N)로 구현하면 됨 [ex: N = "000124"]
function hM_putZeros(n, digits) { //개명예정: hM_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

//기능: 날짜형식 변경(ex: type = '-' => 2013-02-25 / default: 2013.02.25)
function hM_formatDate(date, type) {
  if (type == "") type = ".";
  return date.substr(0, 4) + type + date.substr(4, 2) + type + date.substr(6, 2);
}

//기능: 날짜형식에서 '-', '.' 등 문자 삭제
function hM_unformatDate(date) {
  return date.replace(/[^\d]/g, "");
}

//기능: 오늘 날짜를 'YYYYmmdd' 형식으로 반환
function hM_today() {
  var date = new Date();

  var stamp =
    date.getFullYear() +
    hM_putZeros(date.getMonth() + 1, 2) +
    hM_putZeros(date.getDate(), 2);

  return stamp;
}


//기능: 치료기록, 신상기록 등에 '[2014-01-01 문정삼]' 생성
function hM_makeRcStamp(date, doc) {
  var date = date || hM_formatDate(hM_today(), '-');
  var doc = doc || '';
  return '[' + date + ' ' + doc + ']' + '\n';
}


//기능: 신상기록, 특이사항 등에 '[2014-01-01 문정삼]' 스탬프 추가
function hM_addRcStamp(content, options) {
  var mode = options.mode || 'new';
  var date = options.date || hM_formatDate(hM_today(), '-');
  var doc = options.doc || '문정삼';

  //content가 '[####-' 형식으로 시작하면 mode = 'change'
  if (content.indexOf('[') == 0 && content.indexOf('-') == 5) {
    mode = 'change';
  }

  //
  if (mode == 'new') {
    //return hM_makeRcStamp(date, doc) + content;
    return hM_makeRcStamp(date, doc) + content + '\n';
  } else if (mode == 'change') {
    //return hM_makeRcStamp(date, doc) + content.substr(content.indexOf('\n') + 1);
    return hM_makeRcStamp(date, doc) + content.substr(content.indexOf('\n') + 1) + '\n';
  }
}

//기능: 치료기록 '[2014-01-01 문정삼]' 스탬프 제거
function hM_delRcStamp(content, options) {
  //content가 '[####-' 형식으로 시작하면 개행문자 이후 내용 반환
  if (content.indexOf('[') == 0 && content.indexOf('-') == 5) {
    return content.substr(content.indexOf('\n') + 1);
  } else {
    return content;
  }
}

//기능: str trim
function hM_trim(str) {
  return str.replace(/(^\s*)|(\s*$)/gi, "");
}

//기능: 타임스탬프
function hM_timestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

/*
//기능: input[text, textarea]에서 selectionStart ~ selectionEnd 사이를 선택
function hM_selectRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

//기능: input[text, textarea]에서 pos에 커서를 위치시킴
function hM_caretToPos(input, pos) {
  hM_selectRange(input, pos, pos);
}


//기능: start, end 사이를 선택
//$('#elem').selectRange(3,5); // select a range of text
//$('#elem').selectRange(3); // set cursor position
$.fn.hM_selectRange = function(start, end) {
    if(!end) end = start;
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

//기능: 배열에서 중복 항목 제거 배열 반환
function hM_uniqueArray(arr) {

  var oldArray = arr;
  var b = [];
  var j = 0;
  oldArray.sort();
  while(oldArray.length > 0) {
    var newKey = oldArray.shift();
    if(j == 0) {
      b.push(newKey);
      j++;
    } else if(b[j-1] != newKey) {
      b.push(newKey);
      j++;
    }
  }
  return b;
}
*/
//천단위마다 , 찍기(소수점이 있는 경우도 가능)
function hM_formatNum(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환

    while (reg.test(n))
      n = n.replace(reg, '$1' + ',' + '$2');

    return n;
}

//기능: 문자열 x에 숫자, '.'(1번만으로 수정요!!!) 있으면 d[digits]
//digits에 ','가 포함되어 있으면 n[number(comma)]
//숫자, '.', ','외의 문자가 포함되어 있으면 c[character]
function checkCharacter(x) {
  //123,456789 같은 경우는 잡아내지 못함('.'가 없는 경우의 뒷 숫자 반복)
  if (x.match(/(^[+-]?\d+)(\,\d{3})+\.?\d*$/)) return 'n';
  else if (x.match(/(^[+-]?\d+)\.?\d*$/)) return 'd';
  else return 'c';
}

//jsonArr[json 배열]에 jsonItem[json] 추가
function hM_addJson(jsonArr, jsonItem) {
  jsonArr.push(jsonItem);
}

//jsonArr[json 배열]에서 key값이 val인 json 요소 삭제
function hM_delJson(jsonArr, key, val) {
    for (var i = 0; i < jsonArr.length; i++) {
        var cur = jsonArr[i];
        if (cur[key] == val) {
            jsonArr.splice(i, 1);
            return;
        }
    }
    console.log('jsonArr is not deleted at all');
}

//jsonArr[json 배열]에서 key값이 jsonItem과 동일한 json 요소 변경
//삭제 후 추가
function hM_updJson2(jsonArr, jsonItem, key) {
  var val = jsonItem[key];
    for (var i = 0; i < jsonArr.length; i++) {
        var cur = jsonArr[i];
        if (cur[key] == val) {
          jsonArr.splice(i, 1, jsonItem);
          return;
        }
    }
}

//jsonArr[json 배열]에서 key값이 jsonItem과 동일한 json 요소 변경
//부분 배열요소에 대해 변경
function hM_updJson(jsonArr, jsonItem, key) {
  var val = jsonItem[key];
    for (var i = 0; i < jsonArr.length; i++) {
        var cur = jsonArr[i];
        if (cur[key] == val) {
          //console.log('catched', jsonItem);
          for (k in jsonItem) {
            cur[k] = jsonItem[k];
          }
          return;
        }
    }
}


//col[collection]에서 key값이 jsonItem과 동일한 json 요소 변경
//부분 배열요소에 대해 변경
function hM_updCollection(col, jsonItem, key) {
  var jsonArr = col.toJSON();

  var val = jsonItem[key];
    for (var i = 0; i < jsonArr.length; i++) {
        var cur = jsonArr[i];
        if (cur[key] == val) {
          console.log('catched', jsonItem);
          col.set(jsonItem,{remove: false});
          return;
        }
    }

}

/*
//기능: 제주도 해녀, 4.3
function hM_getJeju(jejucode) {
  var jejucode = hM_trim(jejucode);
  var len = jejucode.length;
  if (len < 8) {
    return '';
  } else if (len == 10) {
    if (jejucode.match('j') || jejucode.match('J')) return '해J';
    else if (jejucode.match('s') || jejucode.match('S')) return '해S';
    else return '??';
  } else if (len == 9) {
    return '4유';
  } else if (len == 8) {
    return '4후';
  } else {
    return '--';
  }
}


//기능: 제주도 해녀, 4.3
function hM_getJeju(jejucode) {
  var jejucode = hM_trim(jejucode);
  var len = jejucode.length;
  if (len < 8) {
    return '';
  } else if (jejucode.match('j') || jejucode.match('J')) {
    return '해J';
  } else if (jejucode.match('s') || jejucode.match('S')) {
    return '해S';
  } else if (len == 9) {
    return '4유';
  } else if (len == 8) {
    return '4후';
  } else {
    return '--';
  }
}
*/

//기능: 제주도 해녀, 4.3
function hM_getJeju(jejucode) {
  var jejucode = hM_trim(jejucode);
  var len = jejucode.length;
  if (len < 8) {
    return '';
  } else if (len == 10) {
    return '해';
  } else {
    return '사';
  }
}


//기능: 진료비 alert, 종별도 적용시켜야 함@@@@@@@@@@
function hM_alertTotal(total, bonbu) {
  if (bonbu == 2100 && total < 19000) {
    return '<span  style="color:#f00">' + hM_formatNum(total) + '</span>';
  } else {
    return hM_formatNum(total);
  }
}

//기능: 본부금 alert, 종별도 적용시켜야 함@@@@@@@
function hM_alertBonbu(age, jeju, bonbu) {
  var ret = hM_formatNum(bonbu);
  if (jeju == '사') {
    if (bonbu > 5500) {
      ret = '<span  style="color:#f00">' + hM_formatNum(bonbu) + '</span>';
    }
  } else if (!jeju) {
    if (bonbu > 2100 && age > 64) {
      ret = '<span  style="color:#f00">' + hM_formatNum(bonbu) + '</span>';
    }
  }
  return ret;
}

/*
//본부금이 2,100인데, 총진료비가 19,000 미만인 경우 표시
function getMtamt($pData1, $pData2) {
  $rData = number_format($pData1);
  if ($pData2 == 2100 && $pData1 < 19000) {
    $rData = decoFontColor(number_format($pData1), 'red');
  }

  return $rData;
}

//65세 이상 본부금이 2,100 넘을 때 표시(4.3이나 해녀: blue, 아니면: red)
function getIramt($pIramt, $pAge, $pJeju) {
  $strLen = strlen($pJeju);
  if ($strLen < 2 && $pIramt > 2100 && $pAge > 64) $rData = decoFontColor(number_format($pIramt), 'red');
  else if ($strLen > 3 && $pIramt > 2100 && $pAge > 64) $rData = decoFontColor(number_format($pIramt), 'blue');
  else $rData = number_format($pIramt);

  return $rData;
}
*/

//기능: 쿠키 생성
function hM_setCookie(cName, cValue, cDay){
  var expire = new Date();
  expire.setDate(expire.getDate() + cDay);
  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
 }

//기능: 쿠키 가져오기
function hM_getCookie(cName) {
  cName = cName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = '';
  if(start != -1){
   start += cName.length;
   var end = cookieData.indexOf(';', start);
   if(end == -1) end = cookieData.length;
   cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}

//기능: 쿠키 제거
function hM_delCookie(cName) {
  var expire = new Date();

  //어제 날짜를 쿠키 소멸 날짜로 설정한다.
  expire.setDate(expire.getDate() - 1);
  document.cookie = cName + "= " + "; expires=" + expire.toGMTString() + "; path=/";
}

//@@@@@@@@@@@@@@@@
function mH_getListUI(opts) {
  var out = {};
  var rs;

  if (opts.LAST) {
    rs = mH_getListLast(opts.LAST, opts.LAST2);
    out.txtLAST = rs[0];
    out.bdgLAST = rs[1];
    /*
    if (opts.LAST == 0) {
      rs = mH_getListLast(opts.LAST2);
      out.txtLAST = rs[0];
      out.bdgLAST = rs[1];
      //out.bdgLAST = 'alert-default';
    } else {
      var rs = mH_getListLast(opts.LAST);
      out.txtLAST = rs[0];
      out.bdgLAST = rs[1];
    }
    */
  }

  if (opts.SEX) {
    out.txtSEX = mH_getListSex(opts.SEX);
  }

  if (opts.AGE) {
    out.txtAGE = mH_getListAge(opts.AGE);
  }

  if (opts.ORDER1) {
    out.bdgORDER1 = 'alert-danger';
    out.txtORDER1 = opts.ORDER1.split('ⓗ')[1];
  } else {
    out.bdgORDER1 = 'alert-info';
    out.txtORDER1 = '';
  }

  if (opts.JTIME) {
    out.txtJTIME = opts.JTIME.substr(0,2) + ':' + opts.JTIME.substr(2,2);
  }

  if (opts.ITYPE) {
    rs = mH_getListItype(opts.ITYPE);
    out.txtITYPE = rs[0];
    out.bdgITYPE = rs[1];
  }

  if (opts.JEJUCODE) {
    rs = mH_getListJeju(opts.JEJUCODE);
    out.txtJEJU = rs[0];
    out.bdgJEJU = rs[1];
  }

  //if (opts.TOTAL) {
  if (opts.TOTAL && opts.BONBU) {
    rs = mH_getListTotal(opts.TOTAL, opts.BONBU);
    out.txtTOTAL = rs[0];
    out.bdgTOTAL = rs[1];

    rs = mH_getListBonbu(opts.AGE, out.txtJEJU, opts.BONBU);
    out.txtBONBU = rs[0];
    out.bdgBONBU = rs[1];
  }
  //}

  if (opts.CHARTED) {
    rs = mH_getPreSunab(opts.CHARTED);
    out.visCHARTED = rs[0];
    out.txtCHARTED = rs[1];
  }

  if (opts.PIC) {
    if (opts.PIC == '[]' && opts.SEX == '0') {
      out.txtPIC = 'default0.png';
    } else if (opts.PIC == '[]' && opts.SEX == '1') {
      out.txtPIC = 'default1.png';
    } else {
      out.txtPIC = JSON.parse(opts.PIC)[0]['CAP_PATH'];
    }
  }

  return out;
}

function _mH_getListLast(i) {
  if (i == 1) {
    return ['어제', 'alert-success'];
  } else if (i < 92) {
    //return ['재진', 'alert-info'];
    return [i, 'alert-info'];
  } else if (i < 40000) {
    //return ['초진', 'alert-warning'];
    return [i, 'alert-warning'];
  } else {
    return ['처음', 'alert-danger'];
  }
}

function mH_getListLast(l1, l2) {
    if (l1 == 0) {
      return _mH_getListLast(l2);
    } else {
      return _mH_getListLast(l1);
    }
}

/*
    if (opts.LAST == 0) {
      rs = mH_getListLast(opts.LAST2);
      out.txtLAST = rs[0];
      out.bdgLAST = rs[1];
      //out.bdgLAST = 'alert-default';
    } else {
      var rs = mH_getListLast(opts.LAST);
      out.txtLAST = rs[0];
      out.bdgLAST = rs[1];
    }
*/


function mH_getListAge(i) {
    if (i < 1) {
      return '<span style="color:#ff0">' + i + '</span>';
    } else if (i < 6){
      return '<span style="color:#f0f">' + i + '</span>';
    } else if (i < 8){
      return '<span style="color:#f0f">' + i + '</span>';
    } else if (i > 64){
      return '<span style="color:#f00">' + i + '</span>';
    } else {
      return i;
    }
}

function mH_getListSex(i) {
    if (i == '0') {
      return '남';
    } else {
      return '여';
    }
}

function mH_getListItype(i) {
  if (i == '직장' || i == '지역' || i == '공교') {
    return ['', 'alert-default'];
  } else if (i == '보호1' || i == '보호2' || i == '2장' ||  i == '의급') {
    return [i, 'alert-danger'];
  } else if (i == '차상위1' || i == '차상위2' || i == '차2장') {
    return [i, 'alert-warning'];
  } else if (i == '자보') {
    return [i, 'alert-success'];
  } else if (i == '일반') {
    return [i, 'alert-primary'];
  } else {
    return [i, 'alert-info'];
  }
}

//기능: 제주도 해녀, 4.3
function mH_getListJeju(jejucode) {
  var jejucode = hM_trim(jejucode);
  var len = jejucode.length;
  if (len < 8) {
    return ['', ''];
  } else if (len == 10) {
    return ['해녀', 'alert-danger'];
  } else {
    return ['4.3', 'alert-success'];
  }
}



//기능: 진료비 alert, 종별도 적용시켜야 함@@@@@@@@@@
function mH_getListTotal(total, bonbu) {
  if (bonbu == 2100 && total < 19000) {
    return [hM_formatNum(total), 'alert-danger'];
  } else {
    return [hM_formatNum(total), 'alert-warning'];
  }
}

//기능: 본부금 alert, 종별도 적용시켜야 함@@@@@@@
function mH_getListBonbu(age, jeju, bonbu) {
  //var ret = hM_formatNum(bonbu);
  return [hM_formatNum(bonbu), 'alert-danger'];
  /*
  if (jeju == '4.3') {
    if (bonbu > 5500) {
      return [hM_formatNum(bonbu), 'alert-danger'];
    }
  } else if (!jeju) {
    if (bonbu > 2100 && age > 64) {
      return [hM_formatNum(bonbu), 'alert-warning'];
    } else {
      return [hM_formatNum(bonbu), ''];
    }
  } else {
      return [hM_formatNum(bonbu), ''];
  }
  */
}

//기능: 수납 예상액, 보험약, 비보험
//{"total":total, "bonbu":bonbu, "chungu":chungu, "bibo":bibo, "sunab": bonbu + bibo};
function mH_getPreSunab(charted) {
  //var json = JSON.parse(JSON.parse(charted)); //@@double parse
  //var json = JSON.parse(charted); //@@double parse
  //console.log('JSON.parse(charted)', json, json.total, json.sunab);
  if (charted.length < 10) {
    console.log('blank json', charted);
    return ['hide', ''];
  } else {
    //console.log('filled json', charted);
    var json = JSON.parse(JSON.parse(charted)); //@@double parse
    var txt = '';
    //if (json.sunab) {
      txt += '수납액: ' + hM_formatNum(json.sunab);
      //console.log('charted added ', txt);
    //}
    if (json.EX) {
      txt += ' // 보험약: ' + json.EX;
      //console.log('charted added ', txt);
    }
    if (json.bibo) {
      txt += ' // 비보험: ' + json.bibo;
      //console.log('charted added ', txt);
    }
    return ['', txt ];
    //return ['', '수납액 '];
    //return ['', '수납액:' + sunab + ',' + '보험약:' + ex +  ',' + '비보험:' + bibo];
  }
  /*
  if (json.total > 0) {
    //return ['', '수납액:' + sunab + ',' + '보험약:' + ex +  ',' + '비보험:' + bibo];
    return ['', '수납액 ' + json.sunab ];
  } else {
    return ['hide', ''];
  }
  */
}





/*
//기능: $obj에 대해서 togClass1, togClass2 class를 toggle
$.fn.hM_toggleIcon = function(togClass1, togClass2) {
  if ($(this).hasClass(togClass1)) {
    return this.removeClass(togClass1).addClass(togClass2);
  } else {
    return this.removeClass(togClass2).addClass(togClass1);
  }
}
*/



/*
//기능 url에서 GET형식, 동기화 방식으로 데이터 요청하고 json형식 데이터 반환
function hM_ajaxJsonGet(url) {
  $.ajax({
    url: url,
    async: false,
    type: 'GET',
    dataType: 'json'
  })
  .done(function(res){
    jsonData = res;
  });
  return jsonData;
}

//기능 url에서 POST형식으로 data를 넘기고, 동기화 방식으로 데이터 요청하고 json형식 데이터 반환
function hM_ajaxJsonPost(url, data) {
  $.ajax({
    url: url,
    async: false,
    type: 'POST',
    data: data,
    dataType: 'json'
  })
  .done(function(res){
    jsonData = res;
  });

  return jsonData;
}


//기능 url에서 POST형식으로 data를 넘기고, view를 닫음, 반환데이터 없음
function hM_ajaxPostModal(url, data, view) {
  $.ajax({
    url: url,
    type: 'POST',
    data: data
  })
  .done(function () {
    console.log('success');
    view.$el.modal("hide");
  })
  .fail(function () {
    console.log('failed');
    return false;
  });
}


//기능 url에서 POST형식으로 data를 넘기고, view를 닫음, 데이터 반환
function hM_ajaxPostModal_(url, data, view) {
  //var jsonData;
  $.ajax({
    url: url,
    async: false,
    type: 'POST',
    data: data,
    dataType: 'json'
  })
  .done(function(res) {
    jsonData = res;
    //console.log('success--------------', jsonData);
    view.$el.modal("hide");
  })
  .fail(function () {
    console.log('failed');
    return false;
  });

  return jsonData;
}
*/
/*
////template file 불러오기
//overrides.js hM_loadTemplate(options)로 대체
function hM_getTemplate(url) {
  var data = '<h1> failed to load url : ' + url + '</h1>';
  $.ajax({
    async: false,
    url: url,
    dataType: 'text',
    success: function(res) {
      data = res;
    }
  });
  return data;
}
*/
//////txtimer object
/* =============================================
Class: hM_txtimer
================================================ */
/*
var hM_txtimer = (function(hM_txtimer, $, undefined) {

  ////global variables
  var intervals = []; //setInterval 이름
  var intvSec = 1;
  var uiPrefix = '#timer_';
  var initTime = '15:00';

  ////global functions
  //기능: countdown
  function countdown(i, cbEndTimer) {
    return function() {
      var remained = downTimer(i);  //timer Down
      if (remained < intvSec ) {
        clear(i)();
        //alarm
        var oAudio = document.getElementById("txAlarm");
        //oAudio.src = "/haniMoon/assets/audio/" + bed + ".wav";
        oAudio.src = "/hM_/assets/audio/02.wav";
        oAudio.play();

        cbEndTimer();
      }
    }
  }

  //기능: clearInterval
  function clear(i){
    return function() {
      clearInterval(intervals[i]);
    }
  }

  //기능: Start AND restart timer
  function startTimer(i, cbStartTimer, cbEndTimer){
    cbStartTimer();
    return function() {
      clear(i)();
      countdown(i, cbEndTimer)();
      intervals[i] = setInterval(countdown(i, cbEndTimer), intvSec*1000); //intvSec(초단위 interval)
    }

  }

  //기능: pause timer
  function pauseTimer(i, cbPauseTimer){
    cbPauseTimer();
    return function() {
      clear(i)();
      //$(uiPrefix + i).text(initTime);
    }
  }

  //intSec: sec 단위 interval
  function downTimer(i) {
    var $ui = $(uiPrefix + i);
    var timer = $ui.text() || initTime;

    var min = parseInt(timer.split(':')[0]);
    var sec = parseInt(timer.split(':')[1]);
    if (sec == 0) {
      min--;
      sec = 60 - intvSec;
    } else {
      sec -= intvSec;
    }

    console.log('timer go on');

    $ui.text(hM_putZeros(min, 2) + ":" + hM_putZeros(sec, 2));
    return parseInt(min*60 + sec);
  }

  //min:sec 형식을 sec로 반환
  function getSec(min_sec) {
    minSec = min_sec.split(":");
    return parseInt(minSec[0])*60 + parseInt(minSec[1]);
  }

  //sec 형식을 min:sec로 반환
  function getStrTimer(sec) {
    interMin = parseInt(sec / 60);
    interSec = parseInt((sec - interMin*60)/intvSec)*intvSec;
    return hM_putZeros(interMin, 2) + ":" + hM_putZeros(interSec, 2);
  }

  //=========================================================
  //타이머 시작
  hM_txtimer.startTimer = function(i, cbStartTimer, cbEndTimer) {
    startTimer(i, cbStartTimer, cbEndTimer)();
  };

  //타이머 중지
  hM_txtimer.pauseTimer = function(i, cbPauseTimer) {
    pauseTimer(i, cbPauseTimer)();
  };

  //모든 타이머 중지
  hM_txtimer.stopAll = function(i) {
    for(i in intervals) {
      clear(i)();
    }

  };

  //inervals [] 요소 갯수(타이머 갯수) 반환
  hM_txtimer.getTimerNum = function() {
    return intervals.length;
  }

  //타이머 세팅
  //intvSec: setInterval 시간 간격
  //uiPrefix: 타이머 ui selector 접두사(?)
  //initTime: 타이머 초기값
  hM_txtimer.setTimer = function(options) {
    intvSec = options.intvSec || 1;
    uiPrefix = options.uiPrefix || '#timer_';
    initTime = options.initTime || '15:00';
  };

  hM_txtimer.getSec = function(i) {
    return getSec($(uiPrefix + i).text());
  };

  hM_txtimer.getStrTimer = function(sec) {
    return getStrTimer(sec);
  };

  return hM_txtimer;
})(window.hM_txtimer || {}, jQuery); //객체 없으면 생성
*/
/*
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
  //template 종류:
  //1) selector: '<script id="..."><div>....</div></script>'
  //2) html: '<div>...</div>'
  //3) 외부1: 단일 tpl => 2)형식 <= 'tplName'
  //4) 외부2: 다중 tpl 파일 => 1형식 <= 'tplName:selector'


  var template;
  if (templateId.charAt(0) == '#') {
    template = Backbone.Marionette.$(templateId).html();
  } else if (templateId.charAt(0) == '<') { //확인요....
    template = eval(templateId);
  }

  if (template.length === 0) {
    //var template = $('#template_' + templateId);
    var tpl_dir = './assets/tpl';
    var tpl_url = tpl_dir + '/' + templateId + '.html';
    var tpl_string = '';

    $.ajax({
      url: tpl_url,
      method: 'GET',
      async: false,
      contentType: 'text',
      success: function (data) {
      tpl_string = data;
      }
    });

    $('head').append('<script id="template_' +
      templateName + '" type="text/template">' + tpl_string + '<\/script>');
    }
}


window.App = {

    get : function(url) {
        var data = "<h1> failed to load url : " + url + "</h1>";
        $.ajax({
            async: false,
            url: url,
            success: function(response) {
                data = response;
            }
        });
        return data;
    }
}



I didn't want to use require.js for this simple task, so I used modified koorchik's solution.

function require_template(templateName) {
    var template = $('#template_' + templateName);
    if (template.length === 0) {
        var tpl_dir = './templates';
        var tpl_url = tpl_dir + '/' + templateName + '.tpl';
        var tpl_string = '';

        $.ajax({
            url: tpl_url,
            method: 'GET',
            async: false,
            contentType: 'text',
            success: function (data) {
                tpl_string = data;
            }
        });

        $('head').append('<script id="template_' +
        templateName + '" type="text/template">' + tpl_string + '<\/script>');
    }
}

require_template('a');
require_template('b');
Why to append templates to document, rather than storing them in javascript object? Because in production version I would like to generate html file with all templates already included, so I won't need to make any additional ajax requests. And in the same time I won't need to make any refactoring in my code, as I use

this.template = _.template($('#template_name').html());




tpl = {

    // Hash of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('tpl/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};
*/