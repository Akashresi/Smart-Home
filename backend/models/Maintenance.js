const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  userId: { type: String, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);