'use strict'

// REQUIRES
var express = require('express');
var bodyParser = require('body-parser');

// EXECUTE EXPRESS
var app = express();

// ROUTER FILES
var user_routes = require('./Routes/userRoutes');
var styles_routes = require('./Routes/stylesRoutes');
var comment_routes = require('./Routes/commentRoutes');

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// RE-ROUTES
app.use('/api', user_routes);
app.use('/api/styles', styles_routes);
app.use('/api', comment_routes);

// TEST-ROUTE
app.get('/test', (req, res) => {
    return res.status(200).send("<h1>API Working and connecting to the browser</h1>");
});

// EXPORT MODULE
module.exports = app;

