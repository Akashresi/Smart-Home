const express = require('express');
const router = express.Router();
const { createHousehold, joinHousehold, getMembers, removeMember, updateMemberRole } = require('../controllers/householdController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/create', protect, createHousehold);
router.post('/join', protect, joinHousehold);
router.get('/members', protect, getMembers);
router.post('/remove-member', protect, isAdmin, removeMember);
router.post('/update-role', protect, isAdmin, updateMemberRole);

module.exports = router;