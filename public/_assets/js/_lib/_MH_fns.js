//////*******************************************
////// 이름: _MH_fns.js (for use => MH_fns)
////// 기능: user functions set(jquery 함수 포함) [for not requireJs]
////// 명명 규칙
////// 1. mH_ : 일반 함수
////// 2. mJ_ : jquery 함수
//////*******************************************

////---------------------------------------------
////string, date 등 관련 함수
////---------------------------------------------

//기능: 숫자 n 앞에 'digits 개수 - n의 자리수'개의 '0'을 놓음
//참고: 반대 기능은 parseInt(N) / parseFloat(N)로 구현하면 됨 [ex: N = "000124"]
function mH_putZeros(n, digits) { //개명예정: mH_padZero
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

//기능: 날짜형식 변경(ex: type = '-' => 2013-02-25 / default: 2013.02.25)
function mH_formatDate(date, type) {
  if (type == "") type = ".";
  return date.substr(0, 4) + type + date.substr(4, 2) + type + date.substr(6, 2);
}

//기능: 날짜형식에서 '-', '.' 등 문자 삭제
function mH_unformatDate(date) {
  return date.replace(/[^\d]/g, "");
}

//기능: 오늘 날짜를 'YYYYmmdd' 형식으로 반환
function mH_today() {
  var date = new Date();

  var stamp =
    date.getFullYear() +
    mH_putZeros(date.getMonth() + 1, 2) +
    mH_putZeros(date.getDate(), 2);

  return stamp;
}

//기능: gap[millisecs] 만큼의 시간 동안 스크립트 지연
function mH_delay(gap) {
  var then,now;
  then = new Date().getTime();
  now = then;
  while((now - then) < gap) {
    now = new Date().getTime();
  }
}


//기능: json data에서 빈 요소 제거
function mH_delEmptyEl(data) {
	var rs = {};
	//console.log('_delEmptyEl', data);
	for(i in data) {
		//console.log('_delEmptyEl', data[i]);
		if (data[i] && data[i].length) {
			console.log('el is not empty', i);
			rs[i] = data[i];
		}
	}
	return rs;
}

//기능: 치료기록, 신상기록 등에 '[2014-01-01 문정삼]' 생성
function mH_makeRcStamp(date, doc) {
  var date = date || mH_formatDate(mH_today(), '-');
  var doc = doc || '';
  return '[' + date + ' ' + doc + ']' + '\n';
}


//기능: 신상기록, 특이사항 등에 '[2014-01-01 문정삼]' 스탬프 추가
function mH_addRcStamp(content, options) {
  var mode = options.mode || 'new';
  var date = options.date || mH_formatDate(mH_today(), '-');
  var doc = options.doc || '문정삼';

  //content가 '[####-' 형식으로 시작하면 mode = 'change'
  if (content.indexOf('[') == 0 && content.indexOf('-') == 5) {
    mode = 'change';
  }

  //
  if (mode == 'new') {
    //return mH_makeRcStamp(date, doc) + content;
    return mH_makeRcStamp(date, doc) + content + '\n';
  } else if (mode == 'change') {
    //return mH_makeRcStamp(date, doc) + content.substr(content.indexOf('\n') + 1);
    return mH_makeRcStamp(date, doc) + content.substr(content.indexOf('\n') + 1) + '\n';
  }
}

//기능: 치료기록 '[2014-01-01 문정삼]' 스탬프 제거
function mH_delRcStamp(content, options) {
  //content가 '[####-' 형식으로 시작하면 개행문자 이후 내용 반환
  if (content.indexOf('[') == 0 && content.indexOf('-') == 5) {
    return content.substr(content.indexOf('\n') + 1);
  } else {
    return content;
  }
}

//기능: str trim
function mH_trim(str) {
  return str.replace(/(^\s*)|(\s*$)/gi, "");
}

//기능: 타임스탬프
function mH_timestamp() {
  return Math.floor(new Date().getTime() / 1000);
}


//기능: input[text, textarea]에서 selectionStart ~ selectionEnd 사이를 선택
function mH_selectRange(input, selectionStart, selectionEnd) {
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
function mH_caretToPos(input, pos) {
  mH_selectRange(input, pos, pos);
}




//기능: 배열에서 중복 항목 제거 배열 반환
function mH_uniqueArray(arr) {

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

//천단위마다 , 찍기(소수점이 있는 경우도 가능)
function mH_formatNum(n) {
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
function mH_addJson(jsonArr, jsonItem) {
  jsonArr.push(jsonItem);
}

//jsonArr[json 배열]에서 key값이 val인 json 요소 삭제
function mH_delJson(jsonArr, key, val) {
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
function mH_updJson2(jsonArr, jsonItem, key) {
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
function mH_updJson(jsonArr, jsonItem, key) {
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
function mH_updCollection(col, jsonItem, key) {
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


//기능: 쿠키 생성
function mH_setCookie(cName, cValue, cDay){
  var expire = new Date();
  expire.setDate(expire.getDate() + cDay);
  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
 }

//기능: 쿠키 가져오기
function mH_getCookie(cName) {
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
function mH_delCookie(cName) {
  var expire = new Date();

  //어제 날짜를 쿠키 소멸 날짜로 설정한다.
  expire.setDate(expire.getDate() - 1);
  document.cookie = cName + "= " + "; expires=" + expire.toGMTString() + "; path=/";
}



//기능: start, end 사이를 선택
//$('#elem').selectRange(3,5); // select a range of text
//$('#elem').selectRange(3); // set cursor position
$.fn.mH_selectRange = function(start, end) {
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


//기능: mH-obj 에, mH-url 의 html을 load
$.fn.mJ_loadHtml = function() {
	$(this.attr('mH-obj')).load(this.attr('mH-url'));
	/*
	$(this.attr('mH-obj')).animate({
    width: [ "toggle", "swing" ],
    height: [ "toggle", "swing" ],
    opacity: "toggle"
  }, 5000, "linear", function() {
    //$( this ).after( "<div>Animation complete.</div>" );
  });
	*/
};


//기능: mH-obj 에 json data를 html요소[text]에 fill시킴(form data)
//용법: html tag 내에 `class="mH-fill"`,  `mH-name = "name1"`이 설정되어 있어야 함
//data 형식: {"name1":"text1", ....}
$.fn.mJ_fillHtml = function(data) {
	console.log('mJ_fillHtml');
	this.find('.mH-fill').each(function(){	//'mH-name'가 있는 요소의 text는 모두 지움
		$(this).html(' ');
	});

	for (i in data) {	//data가 있는 요소에 text 채움
		this.find("[mH-name='" + i + "']").html(data[i]);
	}
};


//기능: clear form data
$.fn.mJ_emptyForm = function() {
	this[0].reset();
};


//기능: jQuery 객체의 데이터를 json 형식으로 반환(name기준!!!), 비어있는 요소는 제외[mH_delEmptyEl(o)]
//용법: var data = $('#userForm').mJ_formToJson();
$.fn.mJ_formToJson = function() {
  var o = Object.create(null),
    elementMapper = function(element) {
      element.name = $.camelCase(element.name);
      return element;
    },
    appendToResult = function(i, element) {
      var node = o[element.name];

      if ('undefined' != typeof node && node !== null) {
        o[element.name] = node.push ? node.push(element.value) : [node, element.value];
      } else {
        o[element.name] = element.value;
      }
    };

  $.each($.map(this.serializeArray(), elementMapper), appendToResult);
  //return o;
  return mH_delEmptyEl(o);
};


//기능: fill form data
//용법: $('#userForm').mJ_formToJson(data);
//data 형식: {'name1':'val1',.... 'name5':['1', '2', '3']}
$.fn.mJ_fillForm = function(data) {
	this[0].reset();

	for (var i in data) {
		console.log(this.find("[name='" + i + "']"));

		//if (typeof data[i] == ('string' || 'number')) {
		if (typeof data[i] != 'object') {
			var oType = this.find("[name='" + i + "']").prop('type');

			if (oType == 'radio') {
				this.find("[name='" + i + "'][value='" + data[i] + "']").prop('checked', true);  //for radio
			} else if (oType == 'select'){
				this.find("[name='" + i + "'] [value='" + data[i] + "']").prop('selected', true);  //for select
			}

			this.find("[name='" + i + "']").val(data[i]);	//for text, textarea

		} else {  //배열(object)인 경우
			console.log('array', i, data[i]);
			if (this.find("[name='" + i + "']").first().prop('type') == 'checkbox') { //for checkbox
				for (var j in data[i]) {
					this.find("[name='" + i + "'][value='" + data[i][j] + "']").prop('checked', true);
				}
			} else { //for select-multiple
				for (var j in data[i]) {
					this.find("[name='" + i + "'] [value='" + data[i][j] + "']").prop('selected', true);
				}
			}
		}
	}
};


/*
loadHtml(opts)

opts.obj : $(e.target).attr('mH-obj') : load한 html을 붙일 jquery object
opts.url : $(e.target).attr('mH-url') : load할 html의 url
opts.type : $(e.target).attr('mH-type') : load할 html을 붙이는 방법('aPpend', 'After', 'Before'), default: P
opts.bfn : $(e.target).attr('mH-bfn') : load전 실행함수
opts.afn : $(e.target).attr('mH-afn') : load후 실행함수

opts.html : $(e.target).attr('mH-html')


loadData(opts)

saveData

*/