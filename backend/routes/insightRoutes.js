const express = require('express');
const router = express.Router();
const { getMonthlyInsights } = require('../controllers/insightController');
const { protect, hasHousehold } = require('../middleware/authMiddleware');

router.get('/monthly', protect, hasHousehold, getMonthlyInsights);

module.exports = router;
