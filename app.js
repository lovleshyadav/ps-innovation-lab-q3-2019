// Required Libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// New dependencies
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');


// Mysql connection
var mysql = require('mysql');
var connection  = require('./lib/db');


// Global paths
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boxRouter = require('./routes/box');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// App session information
app.use(expressSanitizer());
app.use(session({ 
	secret: '123456cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/box', boxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
