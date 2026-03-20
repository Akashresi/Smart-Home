const express = require('express');
const router = express.Router();
const { getMaintenance, addMaintenanceItem, updateMaintenanceItem, deleteMaintenanceItem } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenance).post(protect, addMaintenanceItem);
router.route('/:id').put(protect, updateMaintenanceItem).delete(protect, deleteMaintenanceItem);

module.exports = router;
