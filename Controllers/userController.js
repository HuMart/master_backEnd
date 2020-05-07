'use strict'

var userController = {
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
};

module.exports = userController;