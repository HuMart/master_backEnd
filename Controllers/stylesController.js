'use strict'

var validator = require('validator');
var Style = require('../Models/style');

var stylesController = {
    // TESTING METHOD
    test: (req, res) => {
        return res.status(200).send({
            message: 'testing styles controller'
        });
    },

    save: (req, res) => {


        try {
            var params = req.body;
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'error on the validation, missing data'
            });
        }

        if (validateTitle && validateContent) {
            var style = new Style();

            style.title = params.title;
            style.content = params.content;
            style.image = null;

            style.save((err, styleStored) => {
                if(err || !styleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Style not saved'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    style: styleStored
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'error on the validation, missing data'
            });
        }



    },
};

module.exports = stylesController;