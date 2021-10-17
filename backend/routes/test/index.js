var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Test Page' });
});

router.all('*', function(req, res, next) {
  next(createError(404, '존재하지 않는 api 입니다.'));
});

module.exports = router;
