const Cleaning = require('../models/Cleaning');

const getCleaningTasks = async (req, res) => {
  try {
    const cleanings = await Cleaning.find({ userId: req.user.uid });
    res.json(cleanings);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(cleaning);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const updateCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.findOneAndUpdate({ _id: req.params.id, userId: req.user.uid }, req.body, { new: true });
    if (!cleaning) return res.status(404).json({ message: 'Not found' });
    res.json(cleaning);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteCleaningTask = async (req, res) => {
  try {
    const result = await Cleaning.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Cleaning deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask };