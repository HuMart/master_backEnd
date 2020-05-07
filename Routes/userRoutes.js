'use strict'

var express = require('express');
var userController = require("../Controllers/userController");

var router = express.Router();

router.get('/test', userController.test);
router.post('/testing', userController.testing);

module.exports = router;