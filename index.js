'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_node', { useNewUrlParser: true})
        .then(() => {
            console.log("connection successful");
        })
        .catch(err => console.log(err));