'use strict'

var express = require('express');
var stylesController = require('../Controllers/stylesController');
var router = express.Router();
var md_auth = require('../Middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './Uploads/styles' });

// TESTING METHODS AND ROUTES
router.get('/test', stylesController.test);
// /////////////////////////////////////////////////////////////////////

router.post('/save', md_auth.authenticated, stylesController.save);
router.post('/upload-image/:id', [md_auth.authenticated, md_upload], stylesController.uploadImage);
router.get('/image/:fileName', stylesController.image);
module.exports = router;