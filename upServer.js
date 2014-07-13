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