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
// TEST-ROUTE
app.get('/test', (requ, res) => {
    return res.status(200).send("<h1>API Working and connecting to the browser</h1>");
});
// EXPORT MODULE
module.exports = app;

