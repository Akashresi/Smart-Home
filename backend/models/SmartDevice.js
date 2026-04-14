const mongoose = require('mongoose');

const smartDeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['light', 'termostat', 'lock', 'camera', 'sensor', 'appliance'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['on', 'off', 'locked', 'unlocked', 'online', 'offline'], 
    default: 'online' 
  },
  value: { type: mongoose.Schema.Types.Mixed }, // e.g. brightness, temperature
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true, index: true },
  room: { type: String },
  icon: { type: String },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SmartDevice', smartDeviceSchema);
