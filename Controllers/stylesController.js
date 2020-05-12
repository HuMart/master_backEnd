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
            style.user = req.user.sub;

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

            if (!styleId) {
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

    getStyles: (req, res) => {

        // GET CURRENT PAGE
        if (req.params.page == null || req.params.page == undefined || req.params.page == false || req.params.page == 0 || req.params.page == "0") {
            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }
        // CREATE OPTIONS OF PAGINATION
        var options = {
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        }
        // FIND PAGINATE
        Style.paginate({}, options, (err, styles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error on the request'
                });
            }

            if (!styles) {
                return res.status(404).send({
                    status: 'error not found',
                    message: 'There are nothing to show'
                });
            }

            // RETURN (STYLES, TOTAL OF STYLES, NUMBER OF PAGES)
            return res.status(200).send({
                status: 'success',
                styles: styles.docs,
                totalDocs: styles.totalDocs,
                totalPages: styles.totalPages
            });
        });
    },

    getStylesByUser: (req, res) => {

        // GET USER ID
        var userId = req.params.user;
        // FIND ALL STYLES OF THE USER
        Style.find({
            user: userId
        }).sort([['date', 'descending']])
            .exec((err, styles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error getting this user's styles"
                    });
                }

                if (!styles) {
                    return res.status(404).send({
                        status: 'error',
                        message: "There are not styles to show for this user"
                    });
                }
                // RETURN RESULT

                return res.status(200).send({
                    status: 'success',
                    styles: styles
                });
            });
    },

    getStyle: (req, res) => {

        var styleId = req.params.id;

        Style.findById(styleId)
            .populate('user')
            .exec((err, style) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error on the request'
                    });
                }
                if(!style){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Ther are not style'
                    });
                }
                return res.status(404).send({
                    status: 'success',
                    style: style
                });

            });

    }
};

module.exports = stylesController;