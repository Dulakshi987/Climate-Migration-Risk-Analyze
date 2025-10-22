const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const auth = require('../middleware/auth');

router.post('/calculate', auth, riskController.calculateRisk);
router.get('/assessments', auth, riskController.getRiskAssessments);
router.get('/statistics', auth, riskController.getStatistics);

module.exports = router;