'use strict'

// REQUIRES
var express = require('express');
var bodyParser = require('body-parser');
// EXECUTE EXPRESS
var app = express();
// ROUTER FILES

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// CORS

// RE-ROUTES

// EXPORT MODULE
module.exports = app;

