// Dependencies
const express = require('express');
const dnsController = require('./../controllers/dnsController');

// Launch router
const router = express.Router();

// DNS lookup route
router.route('/lookupType').post(dnsController.lookupDNSType);
router.route('/lookupAll').post(dnsController.lookupDNSAll);

module.exports = router;
