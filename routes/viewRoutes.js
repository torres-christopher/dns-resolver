const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

// Routes
router.get('/', viewsController.getOverview);
router.get('/result', viewsController.getDNSResults);
router.get('/about', viewsController.getAbout);
router.get('/contact', viewsController.getContactUs);
router.get('/privacy', viewsController.getPrivacyPolicy);
router.get('/terms', viewsController.getTermsOfService);

module.exports = router;
