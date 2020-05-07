'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_node', { useNewUrlParser: true})
        .then(() => {
            app.listen(port, () => {
                console.log("Server running in port: http://localhost:3999");
            })
        })
        .catch(err => console.log(err));