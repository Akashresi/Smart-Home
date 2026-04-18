const express = require('express');
const router = express.Router();
const { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenanceTasks).post(protect, createMaintenanceTask);
router.route('/:id').put(protect, authorize('admin', 'member'), updateMaintenanceTask).delete(protect, authorize('admin'), deleteMaintenanceTask);

module.exports = router;