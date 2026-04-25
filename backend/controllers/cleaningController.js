const Cleaning = require('../models/Cleaning');

const getCleaningTasks = async (req, res) => {
  try {
    const cleanings = await Cleaning.find({ householdId: req.user.householdId });
    res.json(cleanings);
  } catch (error) {
    console.error('getCleaningTasks Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.create({ 
      ...req.body, 
      userId: req.user._id,
      householdId: req.user.householdId 
    });
    res.status(201).json(cleaning);
  } catch (error) {
    console.error('createCleaningTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCleaningTask = async (req, res) => {
  try {
    const cleaning = await Cleaning.findOneAndUpdate(
      { _id: req.params.id, householdId: req.user.householdId },
      req.body,
      { new: true }
    );
    if (!cleaning) return res.status(404).json({ message: 'Cleaning task not found' });
    res.json(cleaning);
  } catch (error) {
    console.error('updateCleaningTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCleaningTask = async (req, res) => {
  try {
    const result = await Cleaning.findOneAndDelete({ _id: req.params.id, householdId: req.user.householdId });
    if (!result) return res.status(404).json({ message: 'Cleaning task not found' });
    res.json({ message: 'Cleaning task deleted' });
  } catch (error) {
    console.error('deleteCleaningTask Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCleaningTasks, createCleaningTask, updateCleaningTask, deleteCleaningTask };