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
  const response = {};
  /**
  {
    "title": "1984",
    "cover": "http://.../1984.gif",
    "categories": "",
    "offers": [
      { "site": "amazon", "price": 100, "url": "" },
      { "site": "", "price": 95, "url": "" },
      { "site": "", "price": 80, "url": "" },
      { "site": "", "price": 105, "url": "" }
    ],
    "description": "A dystop",
    "authors": [
      "George Orwell",
      "Another author"
    ],
    "recommended": [
      { "isbn": "29384792837", "title": "Another book", "description" },
    ],
    "reviews": [
      { "username": "", "rating": 3, "comment": "" }
    ]
  }
  */
  
  const offers = {
    
  };
  /**
  offers = {
    'bookdepository': {
      price: 100,
      url: 'something'
    },
    'kino': {
      price: 120
      
    }
  }
  */
  function done() {
    if ('bookdepository' in offers && 'kinokuniya' in offers) {
      response.offers = Object.keys(offers).map(key => {
        const value = offers[key];
        return {
          ...value,
          site: key
        };
      });
      res.json(response)
    }
  }
  
	request(`https://singapore.kinokuniya.com/bw/${req.query.isbn}`, (err, kino) => {
		//var m1 = kino.body.match(/<meta property="og:title" content="([^"]+)"/);
		//var m2 = kino.body.match(/<meta property="og:description" content="([^"]+)"/);
		const doc = (new JSDOM(kino.body)).window;
		
		var kino_title = (doc.document.querySelector('.dContent h1').textContent);
		var kino_desc = (doc.document.getElementsByClassName('dInfoTxt product-descrip readmore-js-section readmore-js-collapsed')[0].textContent);
		var kino_authors = (doc.document.getElementsByClassName('author')[0].querySelectorAll('a'));
		var kino_category = (doc.document.getElementsByClassName('clearfix')[0].querySelector('li:nth-child(2)').textContent);
		var price = (doc.document.getElementsByClassName('price')[0].querySelector('span').textContent);
		//console.log(price);
		var img = (doc.document.getElementsByClassName('slider3')[0].querySelector('img'));
		
    response.isbn = req.query.isbn;
    response.title = kino_title;
    response.cover = img.src;
    response.category = kino_category;
    response.description = kino_desc.trim();
    response.author = Array.from(kino_authors).map(author => author.text);
    
    offers.kinokuniya = {
      price: price,
      url: doc.window.document.querySelector('link[rel="canonical"]').href
    };
    
    done();
	});
  
  request(`https://www.bookdepository.com/search?searchTerm=${req.query.isbn}`, (err, depo) => {
		const depo_dom = new JSDOM(depo.body);
		const book_price = depo_dom.window.document.querySelector('.sale-price').textContent;
    
		offers.bookdepository = {
      price: book_price,
      url: 'https://www.bookdepository.com' + depo_dom.window.document.querySelector('link[rel="canonical"]').href
    };
    
    done();
  });
});

router.get('/amazon', function(req, res, next) {
	request(`https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks-intl-ship&field-keywords=${req.query.isbn}`, (err, emma) => {
		let response = { 'body': emma.body}
    
		res.json(response)
    
  });
});

module.exports = router;	
