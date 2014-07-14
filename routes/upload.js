var mH_utils = require('../mH_utils');
//var async = require('async');
//var bodyParser = require('body-parser');  //npm install --save body-parser
var dateFormat = require('dateformat');
var formidable = require('formidable');
var fs = require('fs');
//@@@@@@@@@@@@@ imagemagick binary 설치되어 이어야 함!!!! <http://www.imagemagick.org/script/binary-releases.php>
var im = require('imagemagick');  //npm install imagemagick@@@
//var app = express();
//app.use(bodyParser()); // instruct the app to use the `bodyParser()` middleware for all routes

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
	var form = new formidable.IncomingForm();
	var id = req.params.id;

	form.parse(req, function(err, fields, files) {
	  //fs.readFile(files.file.path, function(err, data) {@@@

 	  //console.log(files);
	  //console.log(files.file.name, files.file.path);
	  var saveDir = fields.path;

	  var photo = {
	    'CAP_CHAM_ID':id,
	    'CAP_WDATE':dateFormat(new Date(), "yymmdd"),
	    'CAP_SEQ':'00000',
	    'CAP_PATH':'',
	    //'CAP_REMARK':req.body.memo,
	    //'CAP_BIGO1':req.body.uid,
			'CAP_REMARK':fields.memo,
	    'CAP_BIGO1':fields.uid,
	    'CAP_BIGO2':'PHOTO'
	  };

	  //var ohis = mH_utils.OHIS(photo.CAP_CHAM_ID);
	  var ohis = mH_utils.OHIS(id);

	  _getLastPhoto({"ohis":ohis, "data":photo}, function(err, rs){
	    //_getPhotoName({"photo":photo, "file":{"name":"00001.jpg"}}, rs, function(data){
	    _getPhotoName({"photo":photo, "file":{"name":"00001.jpg"}}, rs, function(data){

	    	//resize, save Files  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			  fs.readFile(files.file.path, function(err, image) {
					var imageName = data.CAP_PATH;
					/// If there's an error
					if(!imageName) {
						console.log("There was an error")
						//res.redirect("/");
						//res.end();
					} else {
					  var newPath = saveDir + imageName;
					  console.log(newPath);

					  fs.writeFile(newPath, image, function (err) {
					  	/// write file to uploads/thumbs folder
					  	if (err) console.log('image save error!!!');
					  	else console.log('image save success!!!');
					  });

					}
			  });

	    	/*
	    	var opts = {
					srcPath: newPath,
					dstPath: thumbPath,
					width:
	    	};
	    	*/
	    	//_savePhotoThumb(data.CAP_PATH);


	    	//insertDB
	    	_insPhotoDB({"ohis":ohis, "data":data}, function(err, rs){
	    		res.send(rs);
	    	});
	    });
	  });
	});

}


//CHAM_ID가 id인 환자의 마지막 사진 name, seq 획득
var _getLastPhoto = function(opts, cb) {
	if (!opts.ohis) return false;

	var que = "SELECT TOP 1 CAP_PATH as name, CAP_SEQ as seq FROM OHIS_H.dbo.IM_CAP" + opts.ohis + " WHERE CAP_CHAM_ID = '" + opts.data.CAP_CHAM_ID + "' ORDER BY CAP_SEQ DESC";
	mH_utils.msQueryRs({"que":que}, function(err, rs){
	  cb(err, rs);
	});
}



var _getPhotoName = function(opts, rs, cb) {
  var id = opts.photo.CAP_CHAM_ID;
  var file = opts.file;
  var photo = opts.photo;
  photoExt = _getExtension(file['name']);

  if (!rs || !rs.length) {
    photo['CAP_PATH'] = _setPhotoName({"id":id}) + '.' + photoExt;
  } else {
    var name = rs[0].name;
    var seq = rs[0].seq;
    photo['CAP_PATH'] = _setPhotoName({"id":id, "lastName":rs[0].name}) + '.' + photoExt;
    photo['CAP_SEQ'] = mH_utils.putZeros(parseInt(rs[0].seq) + 1, 5);
  }

  cb(photo);	//callback

}

/*
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
  que = "INSERT INTO OHIS_H.dbo.IM_CAP" + opts.ohis + " " + mH_utils.insStr(opts.data);
  //console.log(que);
  //cb(que);
  mH_utils.msQueryRs({"que":que}, function(err, rs){
    cb(err, rs);
  });
}


//저장될 사진 이름 세팅[id + yy + mm + dd + seq : 0000002500 / 10 / 10 /21 / 00.JPG]@@@@@@@@@@@@@@@@
var _setPhotoName = function(opts) {
  var id = opts.id;
  var lastName = opts.lastName || '0000000000000000';
  var body = mH_utils.putZeros(id, 10) + dateFormat(new Date(), "yymmdd");

  var tail = (body == lastName.substring(0, 16))
    ? mH_utils.putZeros(parseInt(lastName.substring(17, 19)) + 1, 2)
    : '00';
  return body + tail;
}


//확장자 구하기
var _getExtension = function(fName) {
  var arr = fName.split('.');
  return arr[arr.length - 1];
}





exports.saveFile = _saveFile;



/*
--select * from month.dbo.JUBM201407 where jubm_date = '14'
--SELECT TOP 1 CAP_PATH as name, CAP_SEQ as seq FROM OHIS_H.dbo.IM_CAP0011 WHERE CAP_CHAM_ID = '0000000134' ORDER BY CAP_SEQ DESC
DELETE FROM OHIS_H.dbo.IM_CAP0011 WHERE CAP_CHAM_ID = '0000000134' AND CAP_SEQ != '00000'
SELECT * FROM OHIS_H.dbo.IM_CAP0011 WHERE CAP_CHAM_ID = '0000000134' ORDER BY CAP_SEQ DESC
--INSERT INTO OHIS_H.dbo.IM_CAP0011 (CAP_CHAM_ID, CAP_WDATE, CAP_SEQ, CAP_PATH, CAP_REMARK, CAP_BIGO1, CAP_BIGO2) VALUES ('0000000134', '140714', '00001', '000000013414071400.jpg', 'memo', 'D01', 'PHOTO')
*/