'use strict'

var express = require('express');
var stylesController = require('../Controllers/stylesController');
var router = express.Router();
var md_auth = require('../Middlewares/authenticated');
// TESTING METHODS AND ROUTES
router.get('/test', stylesController.test);
// /////////////////////////////////////////////////////////////////////

router.post('/save', md_auth.authenticated, stylesController.save);

module.exports = router;