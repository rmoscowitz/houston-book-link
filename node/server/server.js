var express = require('express')
var app = express()
import { search, libraries } from './pg_service';


app.get('/', function(req, res) {
  res.send('Mock eLibrary api server');
});

app.get('/libraries', function(req, res) {
  console.log('Retrieving mock libraries data');
  // TODO flesh this out
  res.send({
    lib: 1
  });
});

app.get('/search', function(req, res) {
  var params = {
    search: req.query.search,
    libraries: req.query.libraries.split(","),
    limit: req.query.limit,
    offset: req.query.offset
  }
  search(params).then((data) => {
    res.send(data)
  })
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})
