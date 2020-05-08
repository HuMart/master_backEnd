'use strict'

exports.authenticated = (req, res, next) => {

    console.log('middleware');

    next();
};