const Maintenance = require('../models/Maintenance');

const getMaintenanceTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createMaintenanceTask = async (req, res) => {
  try {
    const task = await Maintenance.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMaintenanceTask = async (req, res) => {
  try {
    const task = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMaintenanceTask = async (req, res) => {
  try {
    const result = await Maintenance.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json({ message: 'Maintenance record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMaintenanceTasks, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask };