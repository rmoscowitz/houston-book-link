import {getMockLibraries,getMockSearch, getMockSingleSearch} from './setupMockServer.js';

var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.send('id: ' + req.query.id);
});

app.get('/libraries', function(req, res) {
  console.log('Retrieving mock libraries data');
  getMockLibraries().then((data) => {
    res.send(data);
  });
});

app.get('/search', function(req, res) {
  console.log('Performing mock search');
  if(req.query.author)
  {
    getMockSingleSearch().then((data) => {
      res.send(data);
    });
  }
  getMockSearch().then((data) => {
    res.send(data);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
