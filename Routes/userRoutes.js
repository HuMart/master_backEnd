'use strict'

var express = require('express');
var userController = require("../Controllers/userController");

var router = express.Router();
// TESTING ROUTES 
router.get('/test', userController.test);
router.post('/testing', userController.testing);
////////////////////////////////////////////////

router.post('/register', userController.save);

router.post('/login', userController.login);



module.exports = router;