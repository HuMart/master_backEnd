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
                    if (err) {
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

        // GET COMMENT ID FROM URL
        var commentId = req.params.commentId;

        // GET DATA AND VALIDATE
        var params = req.body;
        try {
            var validateContent = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'No comment added !!'
            });
        }

        if (validateContent) {
            // FIND AND UPDATE SUB-DOCUMENT
            Style.findOneAndUpdate(
                { 'comments._id': commentId },
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                { new: true },
                (err, styleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error updating the comment'
                        });
                    }
                    if (!styleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Ther are no comment to update'
                        });
                    }
                    // RETURN RESPONSE
                    return res.status(200).send({
                        status: 'success',
                        style: styleUpdated
                    });
                });
        }
    },

    delete: (req, res) => {

        // GET STYLE ID AND COMMENT ID FROM URL
        var styleId = req.params.styleId;
        var commentId = req.params.commentId;

        // FIND STYLE
        Style.findById(styleId, (err, style) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error deleting the comment'
                });
            }
            if (!style) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Ther are no comment to delete'
                });
            }

            // SELECT SUB-DOCUMENT COMMENT
            var comment = style.comments.id(commentId);
            // DELETE COMMENT
            if (comment) {
                comment.remove();
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'Ther are no comment to delete'
                });
            }
            // SAVE STYLE
            style.save((err) => {

                // RETURN RES
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error deleting the comment'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    style
                });
            });
        });
    },
};

module.exports = commentController;