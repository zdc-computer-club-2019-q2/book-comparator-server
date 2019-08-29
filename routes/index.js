var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({isbn: req.query.isbn }, null, 3))
});

module.exports = router;
