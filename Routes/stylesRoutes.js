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
router.get('/page/:page?', stylesController.getStyles);
router.get('/user-styles/:user', stylesController.getStylesByUser);
router.get('/style/:id', stylesController.getStyle);
router.put('/style/:id', md_auth.authenticated, stylesController.update);
router.delete('/style/:id', md_auth.authenticated, stylesController.delete);
router.get('/search/:search', stylesController.search);

module.exports = router;