'use strict'
require('dotenv').config();
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = process.env.SECRET_STRING;

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    // var style = {
    //     id: style._id,
    //     title: style.title,
    //     content: style.content
    // }

    return jwt.encode(payload, secret);
};