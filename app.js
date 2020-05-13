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

// RE-ROUTES
app.use('/api', user_routes);
app.use('/api/styles', styles_routes);
app.use('/api', comment_routes);
// TEST-ROUTE
app.get('/test', (requ, res) => {
    return res.status(200).send("<h1>API Working and connecting to the browser</h1>");
});
// EXPORT MODULE
module.exports = app;

