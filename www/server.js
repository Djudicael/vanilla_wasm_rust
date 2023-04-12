const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8081;

// sendFile will go here
app.use('/', express.static(__dirname + '/'));
console.log(__dirname);
app.use('/target', express.static('../target'));
app.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);