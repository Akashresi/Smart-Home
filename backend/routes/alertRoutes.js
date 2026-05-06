const express = require('express');
const router = express.Router();
const { getAlerts, markRead, markAllRead, broadcastAlert } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/broadcast', protect, broadcastAlert);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markRead);

module.exports = router;