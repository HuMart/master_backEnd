'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');

exports.createToken = function (user) {
    let payload = {
        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, 'secret-password-to-generate-token-9999');
};