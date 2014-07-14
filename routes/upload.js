var mH_utils = require('../mH_utils');
var async = require('async');
var dateFormat = require('dateformat');


var express = require("express");
var bodyParser = require('body-parser');  //npm install --save body-parser
var formidable = require('formidable');
var fs = require('fs');
//@@@@@@@@@@@@@ imagemagick binary 설치되어 이어야 함!!!! <http://www.imagemagick.org/script/binary-releases.php>
var im = require('imagemagick');  //npm install imagemagick@@@
//var easyimage = require('easyimage');

var app = express();
var router = express.Router();

//app.use(bodyParser()); // instruct the app to use the `bodyParser()` middleware for all routes
app.use(router);

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
//"<input type='file' name='image' />" +
"<input type='file' accept='image/*' capture='camera' name='image' id='image' />" +
"<input type='submit' /></form>" +
"</body></html>";

//app.get('/', function (req, res){
router.get('/', function (req, res){
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);
});



/// Post files
//app.post('/upload', function(req, res) {
router.post('/upload', function(req, res) {

	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
	  fs.readFile(files.image.path, function(err, data) {

			var imageName = files.image.name

			/// If there's an error
			if(!imageName) {
				console.log("There was an error")
				res.redirect("/");
				res.end();
			} else {
			  var newPath = __dirname + "\\uploads\\fullsize\\" + imageName;
			  var thumbPath = __dirname + "\\uploads\\thumbs\\" + imageName;

			  /// write file to uploads/fullsize folder
			  fs.writeFile(newPath, data, function (err) {
			  	/// write file to uploads/thumbs folder
				  im.resize({
					  srcPath: newPath,
					  dstPath: thumbPath,
					  width: 200,
					  //height: 200
					}, function(err, stdout, stderr){
					  if (err) throw err;
					  console.log('resized image to fit within 200x200px');
					});

				  res.redirect("/uploads/fullsize/" + imageName);

			  });

			}
	  });

	});

});

/// Show files
app.get('/uploads/fullsize/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');

});

app.get('/uploads/thumbs/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/thumbs/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');

});

app.listen(8080);

/*

app->post('/savePhoto/:id', 'savePhoto');
app->post('/saveCanvas/:id', 'saveCanvas');
app->run();

//사진 저장
//rename -> resize, thumbnail 생성, 저장 / DB insert
function savePhoto(id) {

  //print_r(_REQUEST);
  photo = array(
    'CAP_CHAM_ID':id,
    'CAP_WDATE':date('ymd'),
    'CAP_SEQ':'00000',
    'CAP_PATH':'',
    'CAP_REMARK':iconv('UTF-8', 'CP949', _REQUEST['memo']),
    'CAP_BIGO1':_REQUEST['uid'],
    'CAP_BIGO2':'PHOTO'
  );

  //print_r(_REQUEST);
  OHIS = mH_OHISNum(id);
  path = str_replace('\\', '/', _REQUEST['path']) . '/';  //사진 저장 경로 형식 조정(D:\SOM_Photo => D:/SOM_Photo/)
  //echo 'path:' . path;
  //
  lastPhoto = getLastPhoto(id, OHIS);

  photoExt = getExtension(_FILES['file']['name']);

  if (!lastPhoto) {
    photo['CAP_PATH'] = setPhotoName(id) . '.' . photoExt;
  } else {
    photo['CAP_PATH'] = setPhotoName(id, lastPhoto['name']) . '.' . photoExt;
    photo['CAP_SEQ'] = str_pad((int)lastPhoto['seq'] + 1, 5, "0", STR_PAD_LEFT);
    //photo['CAP_PATH'] = setPhotoName(id, lastPhoto->name) . '.' . photoExt;
    //photo['CAP_SEQ'] = str_pad((int)lastPhoto->seq + 1, 5, "0", STR_PAD_LEFT);
  }

  //file resize & thumbnail 생성 => 저장
  //default: reSize=540, thumbSize=54
  resizeFile('file', path, photo['CAP_PATH']);

  //DB에 사진 정보 저장###########
  //insertPhotoDB(OHIS, photo);
  echo json_encode(insertPhotoDB(OHIS, photo));

}

//save canvas
function saveCanvas(id) {
  //echo(id);

    # we are a PNG image
    //header('Content-type: image/png');

    # we are an attachment (eg download), and we have a name
    //header('Content-Disposition: attachment; filename="' . _POST['name'] .'"');

    #capture, replace any spaces w/ plusses, and decode
    encoded = _POST['imgdata'];
    encoded = str_replace(' ', '+', encoded);
    decoded = base64_decode(encoded);

    #write decoded data
    //echo decoded;
    fp = fopen( 'D:/SOM_Photo/canvas/test.png', 'wb' );
    fwrite( fp, decoded);
    fclose( fp );
/*
    # we are a PNG image
    header('Content-type: image/png');

    # we are an attachment (eg download), and we have a name
    header('Content-Disposition: attachment; filename="' . _POST['name'] .'"');

    #capture, replace any spaces w/ plusses, and decode
    encoded = _POST['imgdata'];
    encoded = str_replace(' ', '+', encoded);
    decoded = base64_decode(encoded);

    #write decoded data
    echo decoded;

//----------------------
if (isset(GLOBALS["HTTP_RAW_POST_DATA"]))
{
// Get the data
imageData=GLOBALS['HTTP_RAW_POST_DATA'];

// Remove the headers (data:,) part.
// A real application should use them according to needs such as to check image type
filteredData=substr(imageData, strpos(imageData, ",")+1);

// Need to decode before saving since the data we received is already base64 encoded
unencodedData=base64_decode(filteredData);

//echo "unencodedData".unencodedData;

// Save file. This example uses a hard coded filename for testing,
// but a real application can specify filename in POST variable
fp = fopen( ‘test.png’, ‘wb’ );
fwrite( fp, unencodedData);
fclose( fp );
}
*/
}

/*
//CHAM_ID가 id인 환자의 마지막 사진 name, seq 획득
function getLastPhoto(id, OHIS) {
  sql = "SELECT TOP 1 CAP_PATH as name, CAP_SEQ as seq
      FROM OHIS_H.dbo.IM_CAPOHIS
      WHERE CAP_CHAM_ID = 'id'
      ORDER BY CAP_SEQ DESC";
  return mH_selectRowMSSQL(sql);

}




//bindParam 적용은??#######
//업로드 사진정보 insert(이미지 업로드용2)

CAP_WDATE: 날짜(yymmdd)
CAP_CHAM_ID: 환자 아이디(0000001234)
CAP_SEQ: 사진 일련번호(00001, 초기값:00000)
CAP_PATH: 파일이름(000000261110122200.JPG => CAP_CHAM_ID + CAP_WDATE + 00(날짜별 일련번호))
CAP_REMARK: caption??
CAP_BIGO1: 사진 찍은 사용자(D01, N01,..)
CAP_BIGO2: 형식(default: PHOTO ??)

function insertPhotoDB(OHIS, data) {

    sql = "INSERT INTO OHIS_H.dbo.IM_CAPOHIS " . mH_getInsStr(data);
    //print_r(sql);
    mH_executeMSSQL(sql);

    unset(data['CAP_CHAM_ID']);
    unset(data['CAP_SEQ']);
    unset(data['CAP_BIGO2']);
    return data;

}


//저장될 사진 이름 세팅[id + yy + mm + dd + seq : 0000002500 / 10 / 10 /21 / 00.JPG]
function setPhotoName(id, lastName='') {
  body = str_pad(id, 10, '0', STR_PAD_LEFT) . date('ymd');
  tail = (body == substr(lastName, 0, 16))
    ? str_pad((int)substr(lastName, 17, 2) + 1, 2, '0', STR_PAD_LEFT)
    : '00';
  return body . tail;
}




**
 * Upload한 이미지의 사이즈를 변경하여 저장
 * @param String fieldName : upload file input name
 * @param String targetFile : extension(확장자: jpg/png/gif)도 포함
 * @param String reSize : 리사이즈 긴쪽 길이
 * @param String thumbSize : 썸네일 긴쪽 길이

//public function resizeFile(fieldName, path, targetFile, reSize=1024, thumbSize=120) {
function resizeFile(fieldName, path, targetFile, reSize=540, thumbSize=54) {

  //파일이 선택되지 않은 경우 에러 처리
  if (!_FILES) {
    echo("ERROR1");
    exit;
  }

  image = _FILES[fieldName]['name'];
  uploadedfile = _FILES[fieldName]['tmp_name'];

  filename = stripslashes(image);
  extension = getExtension(targetFile);
  if (!(extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'gif')) {
    echo("ERROR2");
    exit;
  }

  size = filesize(uploadedfile);

  if (extension == "jpg" || extension == "jpeg" ) {
    uploadedfile = _FILES[fieldName]['tmp_name'];
    src = imagecreatefromjpeg(uploadedfile);
  } else if (extension == "png") {
    uploadedfile = _FILES[fieldName]['tmp_name'];
    src = imagecreatefrompng(uploadedfile);
  } else {
    src = imagecreatefromgif(uploadedfile);
  }

  list(width, height) = getimagesize(uploadedfile);

  if (width > height) {
    newWidth = reSize;
    thumbWidth = thumbSize;
    newHeight = (height / width) * newWidth;
    thumbHeight = (height / width) * thumbWidth;
  } else {
    newHeight = reSize;
    thumbHeight = thumbSize;
    newWidth = (width / height) * newHeight;
    thumbWidth = (width / height) * thumbHeight;
  }

  tmpNew = imagecreatetruecolor(newWidth, newHeight);
  tmpThumb = imagecreatetruecolor(thumbWidth, thumbHeight);

  imagecopyresampled(tmpNew, src, 0, 0, 0, 0, newWidth, newHeight, width, height);
  imagecopyresampled(tmpThumb, src, 0, 0, 0, 0, thumbWidth, thumbHeight, width, height);

  //###디렉토리 생성 or/and haniMoon install시 디렉토리 생성
  dosPath = str_replace("//", "\\", path);
  dosPath = str_replace("/", '', dosPath);

  if(!is_dir(path)) {
    exec('mkdir ' .dosPath);
    mkdir(path, 0777);
    chmod(path, 0777);
  }

  if(!is_dir(path. 'thumb/')) {
    exec('mkdir '. dosPath. "\\thumb");
    mkdir(path. 'thumb/', 0777);
    chmod(path. 'thumb/', 0777);
  }

  //저장될 파일 이름
  targetImage = path . targetFile;
  targetThumb = path . 'thumb/' . targetFile;

  imagejpeg(tmpNew, targetImage, 100);
  imagejpeg(tmpThumb, targetThumb, 100);

  imagedestroy(src);
  imagedestroy(tmpNew);
  imagedestroy(tmpThumb);

  return extension;
}


//파일 확장자 구하기
function getExtension(str) {
    i = strrpos(str,'.');
    if (!i) { return ''; }
    l = strlen(str) - i;
    return strtolower(substr(str,i+1,l));
}

*/



//==========================================
var _saveFile = function(req, res) {
  /*
  //case:
  1. image: 신상 사진 / 진료 사진 / 차트(캔버스, ...)
  2. audio:
  3. video:
  4. etc
  */

  //한의맥 연계 파일: 파일 이름, DB저장
  /*
  file 이름 생성, 사진 resize + thumbnail 생성 및 저장, db저장
  */


  var photo = [
    'CAP_CHAM_ID':id,
    'CAP_WDATE':dateFormat(new Date(), "yyyymmdd"),
    'CAP_SEQ':'00000',
    'CAP_PATH':'',
    'CAP_REMARK':req.body.memo,
    'CAP_BIGO1':req.body.uid,
    'CAP_BIGO2':'PHOTO'
  ];

  _getLastPhoto(photo, function(err, rs){
    //getPhotoName();
  });
}


//CHAM_ID가 id인 환자의 마지막 사진 name, seq 획득
var _getLastPhoto = function(opts, cb) {
  //var id = opts.id;
  var id = opts.CAP_CHAM_ID;
  var que = "SELECT TOP 1 CAP_PATH as name, CAP_SEQ as seq FROM OHIS_H.dbo.IM_CAPOHIS WHERE CAP_CHAM_ID = '" + id + "' ORDER BY CAP_SEQ DESC";
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
}


//var _getPhotoName = function(file, rs) {
var _getPhotoName = function(opts, rs) {
  //photoExt = _getExtension(_FILES['file']['name']);
  var id = opts.id;
  var file = opts.file;
  photoExt = _getExtension(file['name']);

  if (!rs.length || !rs) {
    photo['CAP_PATH'] = _setPhotoName(id) + '.' + photoExt;
  } else {
    var name = rs[0].name;
    var seq = rs[0].seq;
    photo['CAP_PATH'] = setPhotoName(id, lastPhoto['name']) . '.' . photoExt;
    photo['CAP_SEQ'] = str_pad((int)lastPhoto['seq'] + 1, 5, "0", STR_PAD_LEFT);
    //photo['CAP_PATH'] = setPhotoName(id, lastPhoto->name) . '.' . photoExt;
    //photo['CAP_SEQ'] = str_pad((int)lastPhoto->seq + 1, 5, "0", STR_PAD_LEFT);
  }
}

/*
//bindParam 적용은??#######
//업로드 사진정보 insert(이미지 업로드용2)
CAP_WDATE: 날짜(yymmdd)
CAP_CHAM_ID: 환자 아이디(0000001234)
CAP_SEQ: 사진 일련번호(00001, 초기값:00000)
CAP_PATH: 파일이름(000000261110122200.JPG => CAP_CHAM_ID + CAP_WDATE + 00(날짜별 일련번호))
CAP_REMARK: caption??
CAP_BIGO1: 사진 찍은 사용자(D01, N01,..)
CAP_BIGO2: 형식(default: PHOTO ??)
*/
//var _insPhotoDB = function(OHIS, data) {
var _insPhotoDB = function(opts, cb) {
  var OHIS = opts.ohis;
  var data = opts.data;

  //sql = "INSERT INTO OHIS_H.dbo.IM_CAPOHIS " . mH_getInsStr(data);
  que = "INSERT INTO OHIS_H.dbo.IM_CAPOHIS " . mH_utils.insStr(data);
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
/*
    unset(data['CAP_CHAM_ID']);
    unset(data['CAP_SEQ']);
    unset(data['CAP_BIGO2']);
    return data;
*/
}


//저장될 사진 이름 세팅[id + yy + mm + dd + seq : 0000002500 / 10 / 10 /21 / 00.JPG]@@@@@@@@@@@@@@@@
var _setPhotoName = function(opts) {
  var id = opts.id;
  var lastName = opts.lastName || '';
  mH_utils.putZeros(id, 10);

  var body = str_pad(id, 10, '0', STR_PAD_LEFT) . date('ymd');

  tail = (body == substr(lastName, 0, 16))
    ? str_pad((int)substr(lastName, 17, 2) + 1, 2, '0', STR_PAD_LEFT)
    : '00';
  return body . tail;
}


//확장자 구하기
var _getExtension = function(fName) {
  var arr = fName.split('.');
  return arr[arr.length - 1];
}