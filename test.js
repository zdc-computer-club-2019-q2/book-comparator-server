request = require('request')
request("https://singapore.kinokuniya.com/bw/9780812993011", (err, res) => console.log(res.body))
