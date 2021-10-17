var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const maria = require('../../maria.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Board Page' });
});


router.get('/list', function(req, res, next) {
  const listOffset = (req.query.page - 1) * req.query.rows
  let sqlQuery = 'SELECT COUNT(*) as cnt FROM `nanoom`.`xe_documents` WHERE module_srl IN (3812)'; // 게시물 갯수 가져오기
  let totalCnt = 0
  let pageIndex = 0

  maria.query(sqlQuery, function(err, rows, fields) { // DB에서 데이터 가져옴
    if(!err) { // 정상이면 데이터 전송
      totalCnt = rows[0].cnt
      pageIndex = totalCnt / req.query.rows
    } else { // Error 발생 시 콘솔창에 표시하고 전송
      console.log("Error : ", err);
    }
  });

  sqlQuery = 'SELECT * FROM `nanoom`.`xe_documents` WHERE module_srl IN (3812) ORDER BY `regdate` DESC LIMIT ' + req.query.rows + ' OFFSET ' + listOffset; // 쿼리 설정
  console.log(sqlQuery)
  maria.query(sqlQuery, function(err, rows, fields) { // DB에서 데이터 가져옴
    if(!err) { // 정상이면 데이터 전송
      res.send({
        total: totalCnt,
        data: rows
      });
    } else { // Error 발생 시 콘솔창에 표시하고 전송
      console.log("Error : ", err);
      res.send(err);
    }
  });

	console.log(req.query.sort)
});

router.get('/detail', function(req, res, next) {
  const sqlQuery = 'SELECT * FROM `nanoom`.`xe_documents` WHERE document_srl IN (' + req.query.docNo + ')'; // 쿼리 설정
  maria.query(sqlQuery, function(err, rows, fields) { // DB에서 데이터 가져옴
    if(!err) { // 정상이면 데이터 전송
      res.send(rows[0]);
    } else { // Error 발생 시 콘솔창에 표시하고 전송
      console.log("Error : ", err);
      res.send(err);
    }
  });
});


router.all('*', function(req, res, next) {
  next(createError(404, '존재하지 않는 api 입니다.'));
});


module.exports = router;
