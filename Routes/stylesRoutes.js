'use strict'

var express = require('express');
var stylesController = require('../Controllers/stylesController');
var router = express.Router();

router.get('/test', stylesController.test);

module.exports = router;