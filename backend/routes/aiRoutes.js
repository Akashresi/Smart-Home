const express = require('express');
const router = express.Router();
const { getSuggestions, getDeviceRecommendations, scanBill } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggestions', protect, getSuggestions);
router.post('/recommend', protect, getDeviceRecommendations);
router.post('/scan-bill', protect, scanBill);

module.exports = router;
