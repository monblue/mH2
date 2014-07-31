var express = require('express')
	, path = require('path')
  , app = express()
  , routes = require('./routes')
  , engine = require('ejs-locals');
//  , routes = require('./routes');


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.set('port', process.env.PORT || 9999);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/photo', express.static('D:\\SOM_Photo'));	//virtual directory

app.get('/', routes.index);

var server = app.listen(app.get('port'), function() {
	//console.log('Express server listening on port ' + app.get('port'));
});
















var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//다음으로, passport의 LocalStrategy를 정의하고, Local Strategy에 의해서 인증시에 호출되는 인증 메서드를 정의한다..
passport.use(new LocalStrategy({
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,function(req, userid, password, done) {
        if (userid=='hello' && password=='world'){
            var user = { 'userid':'hello',
                          'email':'hello@world.com'};
            return done(null,user);
        } else{
            return done(null,false);
        }
    }
));



passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});

/*
serializeUser 메서드에서는 function(user,done)을 이용해서 session에 저장할 정보를 done(null,user)과 같이 두번째 인자로 넘기면 된다. 이때 user로 넘어오는 정보는 앞의 LocalStrategy 객체의 인증함수에서 done(null,user)에 의해 리턴된 값이 넘어온다.
이 예제에서는 이 user 객체 전체를 사용자 session에 저장하였다.
다음으로, node.js의 모든 페이지에 접근할때, 로그인이 되어 있을 경우 모든 사용자 페이지를 접근할 경우 deserilizeUser가 발생한다. deserializeUser에서는 session에 저장된 값을 이용해서, 사용자 Profile을 찾은 후, HTTP Request의  리턴한다.
*/
// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');
    done(null, user);
    //});
});


app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
    function(req, res) {
        res.redirect('/login_success');
    });
/*
login.html에서 POST action으로 들어온 인증처리를 /login에서 하도록 하고 passport.authenticate를 ‘local’ strategy로 호출한다.
그리고 로그인이 성공했을 경우에는 ‘/login_sucess’로 redirect하고, 실패했을 경우에는 ‘/login_fail’로 redirect하도록 하였다.
페이지별로 로그인이 되었는지를 확인하고, 로그인이 되어 있을 경우 HTTP request에서 사용자 정보를 가지고 오는 코드는 다음과 같다.
*/
app.get('/login_success', ensureAuthenticated, function(req, res){
    res.send(req.user);
   // res.render('users', { user: req.user });
});
/*
request.user를 이용하면, deserializeUser에 의해서 저장된 사용자 정보를 꺼내볼 수 있다
Connect 미들웨어의 특성을 이용하여, 매 호출시마다 ensureAuthenticated라는 메서드를 호출하게 해서, 로그인이 되어 있는지를 확인하도록 할 수 있는데,
*/
function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/login.html');
}