var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const history = require('connect-history-api-fallback');
const cors = require('cors');

var app = express();
const maria = require('./maria');
maria.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('env') === 'development' && app.use(cors()); // 개발모드 일때만 활성화

/**
 * 1. /api , /(root) 이외에 경로들은 모두 Error로 내보낸다.
 * 2. createError 하게되면 error handler로 들어온다. 
 */

app.use('/', require('./routes'));
app.use(history());

/**
 * 1. 실제 웹서버에서 필요한 서비스 페이지 부분
 * 2. vue 페이지가 동작
 */
app.use(express.static(path.join(__dirname, './../', 'frontend', 'dist')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(req)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ msg: err.message});
});

module.exports = app;