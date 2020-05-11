'use strict'

var validator = require('validator');
var User = require("../Models/users");
var bcrypt = require('bcryptjs');
var jwt = require('../Services/jwt');
var fs = require('fs');
var path = require('path');

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
        try {
            var params = req.body;
            var validate_name = !validator.isEmpty(params.name);
            var validate_lastName = !validator.isEmpty(params.lastName);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);

        } catch (err) {
            return res.status(404).send({
                message: "Error validating data, missing data"
            });
        }

        if (validate_name && validate_lastName && validate_email && validate_password) {
            var user = new User();

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
        var params = req.body;
        // VALIDATE DATA
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(404).send({
                message: "Error validating data, missing data"
            });
        }


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

    update: function (req, res) {

        // GET PARAMS OF THE USER
        var params = req.body;

        // VALIDATE DATA
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_lastName = !validator.isEmpty(params.lastName);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(404).send({
                message: 'Error validating data, missing data'
            });
        }

        // ELIMINATE UNNECESARY PROPS
        delete params.password;
        var userId = req.user.sub;

        // VALIDATE UNIC EMAIL
        if (req.user.email != params.email) {
            User.findOne({ email: params.email.toLowerCase() }, (err, userFound) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error in the login",
                    });
                }

                if (userFound && userFound.email == params.email) {
                    return res.status(200).send({
                        message: "That email is already in use",
                    });
                }
            });
        } else {

            // FIND AND UPDATE
            User.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error updating the user'
                    });
                }

                if (!userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'error Nothing to update'
                    });
                }

                // RETURN RESPONSE
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }

    },

    uploadAvatar: function (req, res) {

        var fileName = 'Avatar not uploaded...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        // GET FILE FROM REQUEST
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\'); // WARNING: EN LINUX OR MAC var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExtension = extSplit[1];

        // CHECK EXTENSION "ONLY IMAGES" IF NOT VALID: DELETE FILE
        if (fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'gif') {
            fs.unlink(filePath, (err) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'that file is not supported'
                })
            })
        } else {
            // CHECK ID OF THE USER IDENTIFIED
            var userId = req.user.sub;

            // SEARCH AND UPDATE THE OBJECT IN DB
            User.findOneAndUpdate({ _id: userId }, { avatar: fileName }, { new: true }, (err, userUpdated) => {
                if (err || !userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error uploading the image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'avatar uploaded',
                    user: userUpdated
                });
            });



        }

    },

    avatar: (req, res) => {
        var fileName = req.params.fileName;

        var filePath = './Uploads/users/' + fileName;

        fs.exists(filePath, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(filePath));
            } else {
                return res.status(404).send({
                    message: "Image doesn't exist"
                })
            }
        });
    },

    getUsers: (req, res) => {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'not users to show'
                });

            }
            return res.status(200).send({
                status: 'success',
                users
            });
        });

    },

    getUser: (req, res) => {
        var userId = req.params.userId;
        User.findById(userId).exec((err, user) => {
            if(err || !user){
                return res.status(404).send({
                    status: 'error',
                    message: "user doesn't exist"
                });
            }
            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },
};

module.exports = userController;