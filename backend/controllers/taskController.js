const Task = require('../models/Task');
const { validationResult } = require('express-validator');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ householdId: req.user.householdId });
    res.json(tasks);
  } catch (error) {
    console.error('getTasks Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.create({ 
      ...req.body, 
      userId: req.user._id,
      householdId: req.user.householdId 
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('createTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, householdId: req.user.householdId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.json(task);
  } catch (error) {
    console.error('updateTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, householdId: req.user.householdId });
    if (!result) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('deleteTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };