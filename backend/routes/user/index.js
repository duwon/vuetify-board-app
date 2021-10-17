var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.all('*', function(req, res, next) {
  next(createError(404, '존재하지 않는 api 입니다.'));
});


module.exports = router;
