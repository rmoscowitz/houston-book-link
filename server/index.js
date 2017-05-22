import { search, libraries } from './pg_service';

var express = require('express')
var path = require("path")

var app = express()



app.get('/libraries', function(req, res) {
  libraries().then(libs => res.send(libs))
});

app.get('/search', function(req, res) {
  var params = {
    search: req.query.search || '',
    libraries: (req.query.libraries || '').split(","),
    limit: req.query.limit || 20,
    offset: req.query.offset || 0
  }
  search(params).then(data => {
    res.send(data)
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('*', function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.send(express.static(path.resolve(__dirname, '..', 'build', 'index.html')));
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
 })
