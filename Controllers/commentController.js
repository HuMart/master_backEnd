'use strict'

var Style = require('../Models/style');
var validator = require('validator');


var commentController = {
    add: (req, res) => {

        // GET STYLE ID
        var styleId = req.params.styleId;

        // FIND BY ID OF THE STYLE
        Style.findById(styleId).exec((err, style) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error adding comment'
                });
            }

            if (!style) {
                return res.status(404).send({
                    status: 'error',
                    message: "That style doesn't exist"
                });
            }
            // CHECK USER and VALIDATE
            if (req.body.content) {
                try {
                    var params = req.body;
                    var validateContent = !validator.isEmpty(params.content);
                } catch (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'No comment added !!'
                    });
                }
                if (!validateContent) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error validating the comment !!'
                    });
                }
                var comment = {
                    user: req.user.sub,
                    content: req.body.content
                };

                // PUSH IN THE COMMENT ARRAY
                style.comments.push(comment);

                // SAVE THE STYLE 
                style.save((err) => {
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error saving the comment !!'
                        });
                    }

                    // RETURN A RESPONSE
                    return res.status(200).send({
                        status: 'success',
                        style
                    });
                })

            }

        });

    },

    update: (req, res) => {
        return res.status(200).send({
            message: 'update comment working'
        });
    },

    delete: (req, res) => {
        return res.status(200).send({
            message: 'delete comment working'
        });
    },
};

module.exports = commentController;