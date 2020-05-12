'use strict'

var validator = require('validator');
var Style = require('../Models/style');
var fs = require('fs');
var path = require('path');
var jwt = require('../Services/jwt');

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
                if (err || !styleStored) {
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

    uploadImage: (req, res) => {

        var file_name = 'Image not uploaded...';

        if (!req.files) {
            return res.status(404).send({
                staus: 'error',
                message: file_name
            });
        }
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExtension = extSplit[1];

        if (fileExtension != 'png' && fileExtension != 'jpg' && fileExtension != 'jpeg' && fileExtension != 'gif') {
            fs.unlink(filePath, (err) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'that file is not supported'
                });
            });
        } else {
            var styleId = req.params.id;
            
            if(!styleId){
                return res.status(404).send({
                    status: 'error',
                    message: 'missing id'
                });
            }

            Style.findOneAndUpdate({ _id: styleId }, { image: fileName }, { new: true }, (err, styleUpdated) => {
                if (err || !styleUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error uploading the image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    file: styleUpdated
                });
            });
        }
    },

    image: (req, res) => {
        var fileName = req.params.fileName;

        var filePath = './Uploads/styles/' + fileName;

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
};

module.exports = stylesController;