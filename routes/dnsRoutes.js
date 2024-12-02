// Dependencies
const express = require('express');
const dnsController = require('./../controllers/dnsController');

// Launch router
const router = express.Router();

// DNS lookup route
router.route('/lookupTest').post(dnsController.lookupTest);
router.route('/lookupType').post(dnsController.lookupDNSType);

module.exports = router;
