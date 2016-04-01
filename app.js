var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

var index  = require('./routes/index');
var login  = require('./routes/login');
var conf   = require('./routes/conf');
var api    = require('./routes/api');

var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

mongoose.createConnection('mongodb://localhost/hydra');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static('public'));
//app.use('/', express.static(path.join(__dirname, 'stream')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', login);
app.use('/index', index);
app.use('/conf', conf);
app.use('/api', api);

app.get('*', login);

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    //res.redirect('/login');
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
     message: err.message,
     error: {}
 });
});

var Schema = mongoose.Schema;

var UserDetail = new Schema({
    username: String,
    password: String
}, {collection: 'userInfo'});

var UserDetails = mongoose.model('userInfo',UserDetail);

passport.use(new LocalStrategy(function(username, password, done) {
	process.nextTick(function() {
		UserDetails.findOne({
			'username' : username
		}, function(err, user) {
			if (err) {
				console.log(err);
				return done(err);
			}
			if (!user) {
				console.log('user not found');
				return done(null, false);
			}
			if (user.password != password) {
				console.log('invalid password');
				return done(null, false);
			}

			console.log('Logged in ' + user.username);
			return done(null, user);
		});
	});
}));

module.exports = app;