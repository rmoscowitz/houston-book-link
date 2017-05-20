import {getMockLibraries} from './setupMockServer.js';

var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.send('Mock eLibrary API')
});

app.get('/libraries', function(req, res) {
  console.log('Retrieving mock libraries data');
  getMockLibraries().then((data) => {
    res.send(data);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
