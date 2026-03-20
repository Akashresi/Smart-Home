const mongoose = require('mongoose');

const maintenanceSchema = mongoose.Schema({
  deviceName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
