// Dependencies
const express = require('express');
const internalController = require('./../controllers/internalController');

// Launch router
const router = express.Router();

router.get('/', internalController.getDNSData);

module.exports = router;
