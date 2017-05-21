import {
  getMockLibraries,
  getMockSearch,
  getMockAuthorSearch,
  getMockTitleSearch
 } from './setupMockServer.js';

var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.send('Mock eLibrary api server');
});

app.get('/libraries', function(req, res) {
  console.log('Retrieving mock libraries data');
  getMockLibraries().then((data) => {
    res.send(data);
  });
});

app.get('/search', function(req, res) {
  console.log('Performing mock search');
  var search = {
    search: 'some query',
    libraries: [1, 2],
    limit: 10,
    offset: 0
  }
  
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})
