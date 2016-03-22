var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

var index = require('./routes/index'),
    preferences = require('./routes/preferences'),
    planner = require('./routes/planner')
    graph = require('./routes/graph'),
    about = require('./routes/about'),
    camera = require('./routes/camera'),
    login = require('./routes/login')
    auth = require('./routes/auth');

var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/', express.static(path.join(__dirname, 'stream')));
//app.use(express.static(path.join(__dirname, 'stream')));
//app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(express.favicon());

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var mongo = require('./bin/mongo');

app.use(passport.session()); 

app.use('/login', login);
app.use('/index', index);
//app.use('/users', users);
//app.use('/preferences', preferences);
//app.use('/planner', planner);
app.use('/graph', graph);
app.use('/about', about);
app.use('/camera', camera);
//app.use('/auth',auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    res.redirect('/login');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/hydra');

//var db = mongoose.connection;
//var userInfo = require('./model/userInfo');
//var Schema = mongoose.Schema;
//
//var UserDetail = new mongoose.Schema({  
//  username: String,
//  password: String
//},{timestamps: true});

var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    password: String
}, {collection: 'userInfo'});

var UserDetails = mongoose.model('userInfo',UserDetail);
UserDetail.methods.findUser = function (username,password,callback) {
    console.log('CALLED userInfo findUser username:'+username + ' password:'+password );
	var query = this.model('userInfo').find({'username':username,'password':password},callback);
	return query;
}

var UserDetails = mongoose.model('userInfo', UserDetail);
//var mongoose = require('mongoose/');
//mongoose.connect('mongodb://localhost/MyDatabase');
//var UserDetails = mongoose.model('userInfo',UserDetail);

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
	  UserDetails.findOne({'username':username},
		function(err, user) {
			if (err) {
				return done(err); 
			}
			if (!user) {
				return done(null, false); 
			}
			if (user.password != password) { 
				return done(null, false); 
			}
			
			console.log('Logged in ' +user.username);
			return done(null, user);
		});
    });
  }
));

//passport.use(new LocalStrategy(function(username, password, done) {
//  console.log('Got login from username:' + username + ' password:'+password );
//  process.nextTick(function() {
//	  UserDetail.findUser(username,password,function(err,user){
//		if(err) {
//			console.log('passport nextTick error ' + err);
//			return done(err);
//		}
//		console.log('passport nextTick findUser ' + user);
//		return done(null, user);
//	});
//
//  });
//}));

app.get('/auth', function(req, res, next) {
  res.sendfile('views/login.html');
});
module.exports = app;
