'use strict'

var validator = require('validator');
var User = require("../Models/users");
let bcrypt = require('bcryptjs');
let jwt = require('../Services/jwt');

var userController = {
    // TESTING METHODS
    test: (req, res) => {
        return res.status(200).send({
            message: "testing get method in the user controller"
        });
    },
    testing: (req, res) => {
        return res.status(200).send({
            message: "testing post method in the  user controller"
        });
    },
    /////////////////////////

    save: (req, res) => {
        let params = req.body;
        let validate_name = !validator.isEmpty(params.name);
        let validate_lastName = !validator.isEmpty(params.lastName);
        let validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_password = !validator.isEmpty(params.password);

        if (validate_name && validate_lastName && validate_email && validate_password) {
            let user = new User();

            user.name = params.name;
            user.lastName = params.lastName;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.avatar = null;

            User.findOne({ email: user.email }, (err, userExist) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error checking user!"
                    });
                }
                if (!userExist) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(params.password, salt, (err, hash) => {
                            user.password = hash;
                            user.save((err, userSaved) => {
                                if (err) {
                                    return res.status(500).send({
                                        message: "Error saving the user"
                                    });
                                }
                                if (!userSaved) {
                                    return res.status(400).send({
                                        message: "User not saved"
                                    });
                                }

                                return res.status(200).send({
                                    status: "success",
                                    user: userSaved
                                });

                            });
                        });
                    });

                }
                else {
                    return res.status(200).send({
                        message: "That User already exist. Try Again"
                    });
                }
            });
        }
        else {
            return res.status(200).send({
                message: "Userd data is not valid, try again"
            });
        }
    },

    login: (req, res) => {
        // GET PARAMS OF THE REQUEST
        let params = req.body;
        // VALIDATE DATA
        let validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_password = !validator.isEmpty(params.password);

        if (!validate_email || !validate_password) {
            return res.status(200).send({
                message: "Missing user or password"
            });
        }
        // SEARCH FOR USER BY THE EMAIL
        User.findOne({ email: params.email.toLowerCase() }, (err, userFound) => {
            if (err) {
                return res.status(500).send({
                    message: "Error in the login",
                });
            }

            if (!userFound) {
                return res.status(404).send({
                    message: "User not found",
                });
            }
            // IF FOUND    
            // VALIDATE PASSWORD
            bcrypt.compare(params.password, userFound.password, (err, check) => {
                // IF IS RIGHT
                if (check) {
                    // GENERATE TOKEN WITH JWT
                    if (params.getToken) {
                        return res.status(200).send({
                            token: jwt.createToken(userFound)
                        });
                    } else {
                        // CLEAN OBJECT BEFORE RETURNING
                        userFound.password = undefined;
                        // RETURN DATA
                        return res.status(200).send({
                            statuss: 'success',
                            userFound
                        });
                    }

                } else {
                    return res.status(404).send({
                        message: "User or password doesn't match any existing user"
                    });
                }
            });
        });
    },

    update: (req, res) => {
        // CREATE MIDDLEWARE TO VALIDATE TOKEN OF THE USER
        
        // 
        return res.status(200).send({
            message: " testing update route"
        });
    },
};

module.exports = userController;