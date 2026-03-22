const Task = require('../models/Task');
const { validationResult } = require('express-validator');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const task = await Task.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteTask = async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };