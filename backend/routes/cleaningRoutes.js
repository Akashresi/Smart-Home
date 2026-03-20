const express = require('express');
const router = express.Router();
const { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask } = require('../controllers/cleaningController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCleaningTasks).post(protect, createCleaningTask);
router.route('/:id').put(protect, updateCleaningTask).delete(protect, deleteCleaningTask);

module.exports = router;
