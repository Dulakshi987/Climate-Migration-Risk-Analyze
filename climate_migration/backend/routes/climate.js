const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');
const auth = require('../middleware/auth');

router.get('/current', auth, climateController.getClimateData);
router.get('/historical', auth, climateController.getHistoricalData);

module.exports = router;