'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var UserSchema = Schema({
    name: String,       
    lastName: String,
    email: String,
    password: String,
    avatar: String,
    role: String
});

modules.exports = mongoose.model('User', UserSchema);