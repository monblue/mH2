//=============================================================================
// REQUIRE
//=============================================================================
var mH_utils = require('../mH_utils');
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var dateFormat = require('dateformat');
var exec = require('child_process').exec;


//=============================================================================
// 별도 파일로 만들어야할라나??@@@@@@@@@@
//=============================================================================
  //$txMain array group mapping
  var groupMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 77, 88];
  var arrGroup = [0, 2000, 3000, 4000, 4002, 4009, 4020, 4031, 4040, 4050, 4100, 4300, 4500, 4800, 5000, 6000, 7000];

  var Arr_DelStr = ['한방외래·퇴원환자', '/1회당', ' '];
  var Arr_ExDelStr = ['(단미엑스산혼합제)', '아이월드', '◈일분', ':', '엑스과립', '(혼합단미엑스산)'];

  var txMain = [
    {'group':'0', 'name':'진찰', 'gasan':'1', 'width':'150px', 'txitems':[]},
    {'group':'1', 'name':'할증', 'gasan':'1.15', 'width':'150px', 'txitems':[]},
    {'group':'2', 'name':'조제료', 'gasan':'1.15', 'width':'0px', 'txitems':[]},
    {'group':'3', 'name':'침1', 'gasan':'1.15', 'width':'400px', 'txitems':[]},
    {'group':'4', 'name':'특수', 'gasan':'1.15', 'width':'230px', 'txitems':[]},
    {'group':'5', 'name':'침2', 'gasan':'1.15', 'width':'220px', 'txitems':[]},
    {'group':'6', 'name':'뜸구', 'gasan':'1.15', 'width':'150px', 'txitems':[]},
    {'group':'7', 'name':'부항', 'gasan':'1.15', 'width':'200px', 'txitems':[]},
    {'group':'8', 'name':'변증', 'gasan':'1.15', 'width':'150px', 'txitems':[]},
    {'group':'9', 'name':'물리', 'gasan':'1.15', 'width':'150px', 'txitems':[]},
    {'group':'15', 'name':'보험약', 'gasan':'1', 'width':'500px', 'txitems':[]},
    {'group':'77', 'name':'비보', 'gasan':'1', 'width':'500px', 'txitems':[]},
    {'group':'88', 'name':'자보', 'gasan':'1', 'width':'500px', 'txitems':[]}
  ];


  var Arr_MainTX = {
    '10100':'초진', '10200':'재진',
    //'10100':'야간','10200':'공휴','10100030':'토요',
    '40400':'변증', '40011':'경1', '40012':'경2',
    '40120':'분구침', '40091':'전침', '40100':'레이저',
    '40030':'안와', '40070':'척추',
    '40060':'관절', '40080':'투자', '40040':'비강', '40050':'복강', '40092':'전자침',
    '40304':'직접구', '40306':'간접구', '40305':'반흔구', '40307':'기기구', '40312':'습부1',
    '40313':'습부2', '40321':'유관법', '40323':'주관법', '40322':'섬관법', '40700':'온열',
    '40701':'적외선', '40702':'한냉',
    '40011002':'1(자락등)', '40011006':'1(화침등)', '40012002':'2(자락등)', '40012006':'2(화침등)', '40012004':'2(사암등)'
  };


//보조항목
  var Arr_SubTX1 = { //부치료항목
           //'40011':{' ':'--'), //입력 제대로 되는지 확인요@@@
    '40011002':{'0':'자락', '1':'도침', '2':'산침'}, //객체가 아니라 배열로 인식되어버림(0,1,2 순서라서}###########
    '40011006':{'3':'화침', '4':'온침'},
           //'40012':{' ':'--'}, //입력 제대로 되는지 확인요@@@
    '40012002':{'0':'자락', '1':'도침', '2':'산침'}, //객체가 아니라 배열로 인식되어버림(0,1,2 순서라서}###########
    '40012006':{'3':'화침', '4':'온침'},
    '40012004':{'5':'사암', '6':'오행', '7':'체질'},
    '40120':{'1':'이침', '2':'두침', '3':'족침', '4':'수침', '5':'수지침', '6':'면침', '7':'비침', '8':'완과침', '9':'피내침', '10':'피부침', '11':'자석침'},
    '40313':{'1':'두흉', '2':'두요', '3':'두상', '4':'흉요', '5':'흉상', '6':'요하', '7':'두하', '8':'흉하', '9':'요상', '10':'상하'}
    };

  var Arr_SubTX2 = {  //경혈('/'가 json key에 있으면 에러....@@@@@@@@@ '/' -> '_')
    '40030':{'ST001/':'승읍', 'BL001/':'정명'}, //안와
    '40070':{'GV008/':'근축', 'GV014/':'대추', 'GV004/':'명문', 'GV011/':'신도', 'GV012/':'신주', 'GV009/':'지양', 'GV006/':'척중', 'GV016/':'풍부', 'GV003/':'요양관'}, //척추
    '40060':{'LI015/':'견우', 'LI011/':'곡지', 'GB040/':'구허', 'SI010/':'노수', 'PC007/':'대릉', 'ST035/':'독비', 'GB003/':'상관', 'HT003/':'소해', 'LE201/':'슬안', 'BL062/':'신맥', 'LI005/':'양계', 'SI005/':'양곡', 'TE004/':'양지', 'KI006/':'조해', 'LR004/':'중봉', 'TE010/':'천정', 'ST007/':'하관', 'GB030/':'환도'}, //관절
    '40080':{'ST004/ST006/':'지창/협거', 'HN046/GB008/':'태양/솔곡', 'TE021/SI019/':'이문/청궁', 'PC006/TE005/':'내관/외관', 'LI004/SI003/':'합곡/후계', 'TE014/HT001/':'견료/극천', 'BL060/KI003/':'곤륜/태계', 'SP006/GB039/':'삼음교/현종'}, //투자
    '40040':{'HN160/':'내영향'}, //비강
    '40050':{'CV013/':'상완', 'CV012/':'중완', 'CV010/':'하완', 'CV006/':'기해', 'CV004/':'관원', 'CV003/':'중극', 'ST025/':'천추', 'SP015/':'대횡'} //복강
  };
//=============================================================================
// FUNCTIONS
//=============================================================================
//-----------------------------------------------------------------------------
// TXITEMS setting ()
//-----------------------------------------------------------------------------
//// CRUD
/**
* @function:
* @caution:
*/
exports.setTxFile = function(req, res) {

  //path = '..\\..\\_assets\\json\\';
  //path = '..\\public\\_assets\\js\\_share\\';
  path = '.\\public\\_assets\\js\\_share\\';
  //newFile = 'txItems.json';
  newFile = 'TxItems.js';
  oldFile = 'TxItems_old.js';
/*
  if(!is_dir(path)) {
    exec('mkdir ' . path);
    mkdir(path, 0777);
    chmod(path, 0777);
  }
*/

  date = dateFormat(new Date(), "yymmddHHMM");

  fs.rename(path + newFile, path + oldFile + date, function(){

    async.parallel([
      function(callback) {
        _setTxMain(function(data){
          //console.log(data);
          callback(null, data);
        });
      },

      function(callback) {
        _setTxSub(function(data){
          //console.log(data);
          callback(null, data);
        });
      },
    ],

    //callback
    function(err, results) {
      //content = results[0];
      content = 'test.... var txMain = ' + JSON.stringify(results[0]) + ";\r\n\r\n" +
            'var txSub = ' + JSON.stringify(results[1]) + ";";
      //console.log(content);

      fs.writeFile(path + newFile, content, function (err) {
        if (err) console.log('image save error!!!');
        else console.log('image save success!!!');
        res.end();
      });


    });

  });

}


/**
* @function:
* @caution:
*/
exports.setTxMain = function(req, res) {
  _setTxMain(function(data){
    //console.log(data);
    res.send(data);
  });
}

/**
* @function:
* @caution:
*/
exports.setTxSub = function(req, res) {
  _setTxSub(function(data){
    //console.log(data);
    res.send(data);
  });
}





/*
  ///1. 명령 프롬프트에서 실행해야 될 때가 있으므로, batch파일로 만들어서 실행하도록!!!
  $exe1 = 'osql -E -S soms\hanimacCS2 -Q'.'"sp_addlogin '."'haniMS', 'MShani'".'"';
  ///2. 첫번째 명령후 에러가 발생하는 경우가 있음!!!!
  $exe2 = 'osql -E -S soms\hanimacCS2 -Q'.'"USE hanimacCS; EXEC sp_grantdbaccess '."'haniMS';USE month; EXEC sp_grantdbaccess 'haniMS';USE OHIS_H; EXEC sp_grantdbaccess 'haniMS'".'"';
  ///3. 2는 3으로 대체후 명령 프롬프트에서 실행
  $exe3 = 'osql -E -S soms\hanimacCS2 -Q'.'"EXEC sp_addsrvrolemember '."'haniMS', 'sysadmin'".'"';
*/
/**
* @function: create MSSQL user(id: haniMS / pw: MShani) => id/ pw 별도 파일로
* @caution:
*/
exports.createMSUser = function(req, res) {

  var exe1 = 'osql -E -S soms\\hanimacCS2 -Q' + '"sp_addlogin ' + "'haniMS', 'MShani'" + '"';
  ///2 +  첫번째 명령후 에러가 발생하는 경우가 있음!!!!
  var exe2 = 'osql -E -S soms\hanimacCS2 -Q' + '"USE hanimacCS; EXEC sp_grantdbaccess ' + "'haniMS';USE month; EXEC sp_grantdbaccess 'haniMS';USE OHIS_H; EXEC sp_grantdbaccess 'haniMS'" + '"';
  ///3 +  2는 3으로 대체후 명령 프롬프트에서 실행
  var exe3 = 'osql -E -S soms\\hanimacCS2 -Q' + '"EXEC sp_addsrvrolemember ' + "'haniMS', 'sysadmin'" + '"';

	exec(exe1, function(error, stdout, stderr) {
    if ( error != null ) {
      //console.log(stderr);
    }
  });

	exec(exe2, function(error, stdout, stderr) {
    if ( error != null ) {
      //console.log(stderr);
    }
  });

	exec(exe3, function(error, stdout, stderr) {
    if ( error != null ) {
      //console.log(stderr);
    }
  });
}






function _setTxMain(cb) {

  async.parallel([
    function(callback) {
      var arrCode = _.keys(Arr_MainTX);
      _fetchPriceData(arrCode,  function(err, arrPrice){
        i = 0;
        for (j in Arr_MainTX) {
          group = _makeGroup(j);
          for (k in groupMap) {
            if (group == groupMap[k]) {
              txMain[k]['txitems'].push({"code":j, "name":Arr_MainTX[j], "price":arrPrice[i]});
              //array_push(txMain[k]['txitems'], array('code'=>key . '', 'name'=>urlencode(val), 'price'=>arrPrice[i]));
              i++;
            }
            //break;
          }
        }
        callback(err);
      });
    },

    function(callback) {
      //치료항목(조제료)
      _fetchJojeData(function(err, data){
        //console.log(_.findWhere(txMain, {'group':'2'}), data);
        //_.findWhere(txMain, {'group':'2'})['txitems'].push(data);
        _.findWhere(txMain, {'group':'2'})['txitems'] = data;
        callback(null, txMain);
      });
    },

    function(callback) {
      //치료항목(보험약)
      _fetchExData(function(err, data){
        _.findWhere(txMain, {'group':'15'})['txitems'] = data;
        callback(null, txMain);
      });
    },

    function(callback) {
      //치료항목(비보험)
      _fetchHbData(function(err, data){
        _.findWhere(txMain, {'group':'77'})['txitems'] = data;
        callback(null, txMain);
      });
    },

    function(callback) {
      //치료항목(자동차보험)
      _fetchCarData(function(err, data){
        _.findWhere(txMain, {'group':'88'})['txitems'] = data;
        callback(null, txMain);
      });
    }
  ],

  //callback
  function(err, results) {
    //cb(err, results[0].concat(results[1], results[2]))
    cb(txMain);
  });

}



function _setTxSub(cb) {
  var txSub = [];

  for (i in Arr_SubTX1) {
    var temp = {'mainCode':'', 'subItems':[]};
    temp['mainCode'] = i + ''; //숫자 -> 문자화 @@@ 필요한지 확인요
    for (j in Arr_SubTX1[i]) {
      temp['subItems'].push({'OPSC_BIGO5': j + '', 'name':Arr_SubTX1[i][j]});
    }
    txSub.push(temp);
  }

  //경혈 항목(Arr_SubTX2)
  for (i in Arr_SubTX2) {
    var temp = {'mainCode':'', 'subItems':[]};
    temp['mainCode'] = i + ''; //숫자 -> 문자화 @@@ 필요한지 확인요
    for (j in Arr_SubTX2[i]) {
      //temp['subItems'].push({'OPSC_BIGO2': j.replace('_', '/') + '', 'name':Arr_SubTX2[i][j].replace('_', '/')});
      temp['subItems'].push({'OPSC_BIGO2': j + '', 'name':Arr_SubTX2[i][j]});
      //console.log(Arr_SubTX1[i][j].replace('_', '/')); //Cannot read property 'ST001_' of undefined
    }
    txSub.push(temp);
  }

  cb(txSub);
  //return txSub;

}



//조제료 데이터
function _fetchJojeData(cb) {
  //$Arr_DelStr = array('한방외래·퇴원환자', '/1회당', ' ');
  //$db = getMSConnection();
  que = "SELECT MOMM_ID AS code, MOMM_HNAME AS name, MOMM_M1_SUGA AS price" +
    	" FROM hanimacCS.dbo.CC_MOMM" +
    	" WHERE MOMM_HNAME like '%조제%'" +
    	" AND LEN(MOMM_ID) = 5" +
    	" AND substring(MOMM_ID, 1, 1) = '3'";

  mH_utils.msQueryRs({"que":que}, function(err, rs){
  	for (i in rs) {
  		for (j in Arr_DelStr) {
  			rs[i]['name'] = rs[i]['name'].replace(Arr_DelStr[j], '');
        //console.log(rs[i]['name']);
  		}
  	}
    cb(err,rs);
  });

}

//Ex제 code, name 쌍 데이터
function _fetchExData(cb) {

	//기준처방
  var que1 = "SELECT INSHG_ID AS code, INSHG_NAME AS name, momm.MOMM_M1_SUGA AS price" +
  				" FROM hanimacCS.dbo.H_INSHG AS inshg" +
      		" INNER JOIN hanimacCS.dbo.CC_MOMM AS momm" +
      		" ON momm.MOMM_ID = inshg.INSHG_ID";

  //임의처방
  var que2 = "SELECT '`' + HPACK_ID AS code, 'C' + HPACK_NAME AS name, HPACK_GUMAK AS price" +
    				" FROM hanimacCS.dbo.CC_HPACK AS exC" +
    				" WHERE HPACK_ID LIKE 'C0%'";

  //가감처방
  var que3 = "SELECT '`' + HPACK_ID AS code, 'G' + HPACK_NAME AS name, HPACK_GUMAK AS price" +
  					" FROM hanimacCS.dbo.CC_HPACK AS exG" +
    				" WHERE HPACK_ID LIKE 'G0%'";

  async.parallel([
    function(callback) {  //기준처방
      mH_utils.msQueryRs({"que":que1}, function(err, rs){
        async.each(rs, function(r, callback2) {
          for (j in Arr_ExDelStr) {
            r['name'] = r['name'].replace(Arr_ExDelStr[j], '');
            //console.log(r['name'], Arr_ExDelStr[j]);
          }
          callback2(err);
        }, function(err) {  //callback
          callback(null, rs);
        });
      });
    },

    function(callback) {  //임의처방
      mH_utils.msQueryRs({"que":que2}, function(err, rs){
        callback(null, rs);
      });
    },

    function(callback) {  //가감처방
      mH_utils.msQueryRs({"que":que3}, function(err, rs){
        callback(null, rs);
      });
    }
  ],

  //callback
  function(err, results) {
    //console.log(results[0], results[1]);
    cb(err, results[0].concat(results[1], results[2]))
  });

}


//비보험 항목 데이터
function _fetchHbData(cb) {
  var que = "SELECT HBSU_ID AS code, HBSU_NAME AS name, HBSU_AMT AS price" +
          " FROM hanimacCS.dbo.CC_HBSU" +
          " WHERE HBSU_DEL = '0'";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err,rs);
  });
}

//select * from hanimacCS.dbo.CAR_JHBSU50 (자보 비보험??)

//select * from hanimacCS.dbo.CC_MOMMJ
//SELECT J_코드 AS code, J_명칭 AS name, J_금액 AS price from hanimacCS.dbo.CC_MOMMJ
//J_인덱스 J_적용일자  J_코드구분  J_코드  J_행위구분  J_명칭  J_비급여 J_금액  J_규격  J_수량  J_제형구분  J_포장상태  J_업체명 J_표준코드  J_순서  J_표시  J_삭제  J_삭제일자  J_조제료
//1 20130715  0 49020 0 경근저주파요법(TENS) 0 3485    0         1 0 0   NULL
//2 20050823  0 92010 1 제일한방파프수(1매) 0 383 67.2밀리그램  6 매 팩 제일약품(주) 8806454036310 1 0 0   NULL
//자동차보험 항목 데이터
function _fetchCarData(cb) {
  //$db = getMSConnection();
  que = "SELECT J_코드 AS code, J_명칭 AS name, J_금액 AS price" +
  			" from hanimacCS.dbo.CC_MOMMJ";

  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err,rs);
  });
}


//@@@@@@@@@@@@@async for
//치료항목별 가격 데이터
function _fetchPriceData(arrCode, cb) {
  var data = [];
  async.each(arrCode, function(code, callback) {
    que = "SELECT MOMM_M1_SUGA AS price" +
          " FROM hanimacCS.dbo.CC_MOMM" +
          " WHERE MOMM_ID = '" + code + "'";

    mH_utils.msQueryRs({"que":que}, function(err, rs){
      //console.log("data['PX2'].push", rs[j]);
      data.push(rs[0]['price']);
      //callback(null, data);
      callback();
    });

  }, function(err) {  //callback
    //console.log('loop is ended');
    //res.send(data);
    cb(err, data);
  });
}


//치료 그룹 생성
function _makeGroup(code) {
  //치료 그룹을 만들기 위한 배열
  var arrGroup = [0, 2000, 3000, 4000, 4002, 4009, 4020, 4031, 4040, 4050, 4100, 4300, 4500, 4800, 5000, 6000, 7000];

//        if (substr($code, 0, 4) == 'HBSU') return 77;   //비보험
//        if (substr($code, 0, 1) == '`' || substr($code, 0, 1) == '6' || ord(substr($code, 0, 1)) > 64) {
//            return 15;
//        }

  var code4 = code.substr(0, 4);
  for (i=0, len = arrGroup.length; i<len-1; i++) {
    if ((code4 >= arrGroup[i]) && (code4 < arrGroup[i+1])) {
      return i;
    }
  }
}


/*
function createUser() {
  ///1. 명령 프롬프트에서 실행해야 될 때가 있으므로, batch파일로 만들어서 실행하도록!!!
  $exe1 = 'osql -E -S soms\hanimacCS2 -Q'.'"sp_addlogin '."'haniMS', 'MShani'".'"';
  ///2. 첫번째 명령후 에러가 발생하는 경우가 있음!!!!
  $exe2 = 'osql -E -S soms\hanimacCS2 -Q'.'"USE hanimacCS; EXEC sp_grantdbaccess '."'haniMS';USE month; EXEC sp_grantdbaccess 'haniMS';USE OHIS_H; EXEC sp_grantdbaccess 'haniMS'".'"';
  ///3. 2는 3으로 대체후 명령 프롬프트에서 실행
  $exe3 = 'osql -E -S soms\hanimacCS2 -Q'.'"EXEC sp_addsrvrolemember '."'haniMS', 'sysadmin'".'"';


///1. 명령 프롬프트에서 실행해야 될 때가 있으므로, batch파일로 만들어서 실행하도록!!!
//osql -E -S soms\hanimacCS2 -Q"sp_addlogin 'haniMS', 'MShani'"
///2. 첫번째 명령후 에러가 발생하는 경우가 있음!!!!
//osql -E -S soms\hanimacCS2 -Q"USE hanimacCS; EXEC sp_grantdbaccess 'haniMS';USE month; EXEC sp_grantdbaccess 'haniMS';USE OHIS_H; EXEC sp_grantdbaccess 'haniMS'"
///3. 2는 3으로 대체후 명령 프롬프트에서 실행
//osql -E -S soms\hanimacCS2 -Q"USE hanimacCS; EXEC sp_change_users_login update_one, 'haniMS', 'haniMS';USE Month; EXEC sp_change_users_login update_one, 'haniMS', 'haniMS';USE OHIS_H; EXEC sp_change_users_login update_one, 'haniMS', 'haniMS'
////4.
//osql -E -S soms\hanimacCS2 -Q"EXEC sp_addsrvrolemember 'haniMS', 'sysadmin'"



  echo exec($exe1);
  echo exec($exe2);
  echo exec($exe3);
}


function createFunction() {

//------------------------------------------------------------
// 사용자 정의함수(DB: hanimacCS)
//------------------------------------------------------------
//////////hanimacCS.dbo.UF_getAge: 환자 나이 구함
$connect = mssql_connect('localhost\hanimacCS2', 'haniMS', 'MShani') or die("fail to connect DB");
mssql_select_db('hanimacCS', $connect);

$sql = "
CREATE function UF_getAge(
    @cham_Jumin char(13),
    @currFull   char(8)
)
RETURNS int

AS
BEGIN

Declare
    @Jumin1 char(6),
    @Jumin2 char(1),
    @birthFull  char(8),
    @age int

--주민번호가 없다면
IF (len(@cham_Jumin) < 7)
    RETURN -1

SET @Jumin1 = substring(@cham_Jumin, 1, 6)
SET @Jumin2 = substring(@cham_Jumin, 7, 1)

IF ((@jumin2 = '0') OR (@jumin2 = '9'))
   SET @birthFull =  '18' + @jumin1
ELSE IF ((@jumin2 = '1') OR (@jumin2 = '2') OR (@jumin2 = '5') OR (@jumin2 = '6'))
   SET @birthFull =  '19' + @jumin1
ELSE IF ((@jumin2 = '3') OR (@jumin2 = '4') OR (@jumin2 = '7') OR (@jumin2 = '8'))
   SET @birthFull =  '20' + @jumin1

SET @age = convert(int, substring(@currFull, 1, 4)) - convert(int, substring(@birthFull, 1, 4)) - 1
IF(convert(int, substring(@birthFull, 5, 4)) <= substring(@currFull, 5, 4))
     SET @age = @age + 1

RETURN @age
END
";

mssql_query($sql);

//db close

}
*/