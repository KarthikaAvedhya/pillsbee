
const express = require('express');
const bodyParser = require('body-parser');
const ParseServer = require('parse-server').ParseServer;
const mysql = require('mysql');
const path = require('path')

const app = express();
app.use(bodyParser.json());

// const parseServerOptions = {
//   databaseURI: 'mysql://localhost:3306/pillsbee',
//   appId: 'myAppId',
//   masterKey: 'myMasterKey',
//   serverURL: 'http://localhost:8080/parse',
//   cloud: './cloud/main.js', // Path to your Cloud Functions file
// };

// const parseServer = new ParseServer(parseServerOptions);

// app.use('/parse', parseServer);
  var employeeRouter = require('./routes/employee');
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', employeeRouter);
  app.use('/employee', employeeRouter);
  app.set('views', path.join(__dirname, 'views'));

app.listen(8080, function () {
  console.log('Parse Server is running on port');
});

module.exports = app;