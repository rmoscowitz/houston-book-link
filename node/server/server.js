var express = require('express')
var app = express()
var search = require('./pg_service');


app.get('/', function(req, res) {
  res.send('Mock eLibrary api server');
});

app.get('/libraries', function(req, res) {
  console.log('Retrieving mock libraries data');
  res.send({
    lib: 1
  });
});

app.get('/search', function(req, res) {
  var params = {
    search: 'some query',
    libraries: [1, 2],
    limit: 10,
    offset: 0
  }
  search(params).then((data) => {
    console.log(data)
    res.send(data)
  })
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})
