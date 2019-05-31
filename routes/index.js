var express = require('express');
var router = express.Router();

var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
	request(`https://singapore.kinokuniya.com/bw/${req.query.isbn}`, (err, kino) => {
		var m1 = kino.body.match(/<meta property="og:title" content="([^"]+)"/);
		var m2 = kino.body.match(/<meta property="og:description" content="([^"]+)"/);

		res.json({
			isbn: req.query.isbn,
			title: m1[1],
			description: m2[1],
		});
	});
});

module.exports = router;	
