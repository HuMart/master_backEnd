'use strict'

var express = require('express');
var userController = require("../Controllers/userController");

var router = express.Router();
var md_auth = require('../Middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './Uploads/users' });
// TESTING ROUTES 
router.get('/test', userController.test);
router.post('/testing', userController.testing);
////////////////////////////////////////////////

router.post('/register', userController.save);

router.post('/login', userController.login);

router.put('/update', md_auth.authenticated, userController.update);

router.post('/upload-avatar', [md_auth.authenticated, md_upload], userController.uploadAvatar);



module.exports = router;