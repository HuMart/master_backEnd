'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret-password-to-generate-token-9999';

exports.authenticated = function(req, res, next) {
    // VALIDATE AUTHORIZATION HEADER
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "missing authorization header"
        });
    }
    // CLEAN TOKEN 
    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    try{
        // DECODE TOKEN
        var payload = jwt.decode(token, secret);

        // VALIDATE EXPIRATION OF TOKEN
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: "token has expired"
            });
        }
    }catch(ex){
        return res.status(404).send({
            message: "token not valid"
        });
    }   

    // ADD USER IDENTIFIED TO THE REQUEST
    req.user = payload;
    
    next();
};