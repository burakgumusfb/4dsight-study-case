process.env.NODE_ENV = require("./package.json")["env"]
var express = require('express');


var usersApi = require('./src/api/users');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: false
  }));

// app.use(function (req, res, next) {
//     auth.authChecker(req, res, next);
// });


app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersApi);

app.listen(3100);