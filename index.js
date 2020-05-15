'use strict'

var mongoose = require('mongoose');
var app = require('./app');
require('dotenv').config();
var port = process.env.PORT;
var host = process.env.HOST;
// console.log(process.env);


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_node', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log("Server running in port: " + port);
        });
    })
    .catch(err => {
        console.log(err);
    });