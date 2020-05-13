'use strict'

var express = require('express');
var commentController = require('../Controllers/commentController');
var router = express.Router();
var md_auth = require('../Middlewares/authenticated');

router.post('/comment/style/:styleId', md_auth.authenticated, commentController.add);
router.put('/comment-update/:commentId', md_auth.authenticated, commentController.update);
router.delete('/comment-delete/:styleId/:commentId', md_auth.authenticated, commentController.delete);

module.exports = router;