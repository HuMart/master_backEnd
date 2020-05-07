'use strict'

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
        return res.status(200).send({
            message: "User registered"
        });
    },
};

module.exports = userController;