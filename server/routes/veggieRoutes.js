const express = require('express');
const router = express.Router();
const veggieController = require('../controllers/veggieController');

/**
 *  App Routes
 */

router.get('/', veggieController.homepage);

module.exports = router;
