import { search, libraries } from './pg_service';
import { addAvailability } from './availability';

var express = require('express');
var path = require('path');
var app = express();

app.get('/libraries', function(req, res) {
  console.log(`GET /libraries -- ${new Date().toLocaleString()}`);
  libraries().then(libs => res.send(libs))
});

app.get('/search', function(req, res) {
  console.log(`GET /search -- ${new Date().toLocaleDateString()}`);
  var params = {
    search: req.query.search || '',
    libraries: (req.query.libraries || '').split(","),
    limit: req.query.limit || 20,
    offset: req.query.offset || 0
  }
  search(params)
    .then(data => {
      return addAvailability(data);
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error(err);
    })
});

app.use(express.static('build'));
app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(path.resolve('build/index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`)
});
