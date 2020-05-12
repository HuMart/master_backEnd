'use strict'

var stylesController = {
    test: (req, res) => {
        return res.status(200).send({
            message: 'testing styles controller'
        });
    },
};

module.exports = stylesController;