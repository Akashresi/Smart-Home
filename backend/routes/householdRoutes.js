const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getMembers } = require('../controllers/householdController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createHousehold);
router.post('/join', protect, joinHousehold);
router.get('/members', protect, getMembers);

module.exports = router;