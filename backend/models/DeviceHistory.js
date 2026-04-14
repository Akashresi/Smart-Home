const mongoose = require('mongoose');

const deviceHistorySchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartDevice', required: true, index: true },
  action: { type: String, required: true }, // e.g. 'turned_on', 'locked', 'temp_changed'
  value: { type: mongoose.Schema.Types.Mixed },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tracking who did what
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeviceHistory', deviceHistorySchema);
