var express = require('express');
var router = express.Router();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  const price_list = {};
  function done() {
    if ('bookdepository' in price_list && 'kinokuniya' in price_list) {
    }
  }
	request(`https://singapore.kinokuniya.com/bw/${req.query.isbn}`, (err, kino) => {
		//var m1 = kino.body.match(/<meta property="og:title" content="([^"]+)"/);
		//var m2 = kino.body.match(/<meta property="og:description" content="([^"]+)"/);
		const doc = (new JSDOM(kino.body)).window;
		
		var m1 = (doc.document.getElementsByClassName('dContent')[0].querySelector('h1').textContent);
		var m2 = (doc.document.getElementsByClassName('dInfoTxt product-descrip readmore-js-section readmore-js-collapsed')[0].textContent);
		var m3 = (doc.document.getElementsByClassName('author')[0].querySelectorAll('a'));
		var m4 = (doc.document.getElementsByClassName('clearfix')[0].querySelector('li:nth-child(2)').textContent);
		//var price = (doc.document.getElementsByClassName('price')[0].querySelector('span').textContent);
		//console.log(price);
		var img = (doc.document.getElementsByClassName('slider3')[0].querySelector('img'));
		
		var authors_array = [];
		Array.from(m3).forEach(function(m){
			authors_array.push(m.textContent);
		})
		res.json({
			isbn: req.query.isbn,
			title: m1,
			cover: img.src,
			category: m4,
			description: m2.trim(),
			author: authors_array,
		});
    
    done();
	});
  
  request(`https://www.bookdepository.com/search?searchTerm=${req.query.isbn}`, (err, depo) => {
		const depo_dom = new JSDOM(depo.body)
		// ser = depo_dom.serialize()
		// console.log(ser)
		const book_title = depo_dom.window.document.querySelector('.item-info').querySelector('h1[itemprop="name"').textContent;
		console.log(book_title)
		const book_price = depo_dom.window.document.querySelector('.sale-price').textContent
		console.log(book_price)
    
		price_list["bookdepository"] = book_price
  });
});

module.exports = router;	
