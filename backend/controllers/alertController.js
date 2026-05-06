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

const User = require('../models/User');

const broadcastAlert = async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!req.user.householdId) {
      return res.status(403).json({ message: 'Household required' });
    }

    const members = await User.find({ householdId: req.user.householdId });
    
    const alertsToCreate = members
      .filter(m => m._id.toString() !== req.user._id.toString())
      .map(m => ({
        type: type || 'emergency',
        message: message,
        userId: m._id
      }));

    if (alertsToCreate.length > 0) {
      await Alert.insertMany(alertsToCreate);
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`household_${req.user.householdId.toString()}`).emit('new_emergency_alert', {
        type: type || 'emergency',
        message: message,
        sender: req.user.name
      });
    }

    res.json({ message: 'Alert broadcasted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAlerts, markRead, markAllRead, broadcastAlert };