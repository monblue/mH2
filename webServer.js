
var express = require('express');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 9999);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/photo', express.static('D:\\SOM_Photo'));	//virtual directory

var server = app.listen(app.get('port'), function() {

});