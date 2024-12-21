const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

// Routes
router.get('/', viewsController.getOverview);
router.get('/result', viewsController.getDNSResults);

module.exports = router;
