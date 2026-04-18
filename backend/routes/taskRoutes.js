const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, [check('title').notEmpty()], createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('admin', 'member'), deleteTask);

module.exports = router;