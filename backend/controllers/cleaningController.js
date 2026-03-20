const Cleaning = require('../models/Cleaning');

exports.getCleaningTasks = async (req, res) => {
  try {
    const schedules = await Cleaning.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCleaningTask = async (req, res) => {
  try {
    const schedule = await Cleaning.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCleaningTask = async (req, res) => {
  try {
    const schedule = await Cleaning.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCleaningTask = async (req, res) => {
  try {
    await Cleaning.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cleaning schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
