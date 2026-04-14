const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id, read: false }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const markRead = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true }, { new: true });
    res.json(alert);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const markAllRead = async (req, res) => {
  try {
    await Alert.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All read' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getAlerts, markRead, markAllRead };