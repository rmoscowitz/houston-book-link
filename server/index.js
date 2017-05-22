import { search, libraries } from './pg_service';

var express = require('express')

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

app.use(express.static('build'));
app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(express.static('build/index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`)
});
