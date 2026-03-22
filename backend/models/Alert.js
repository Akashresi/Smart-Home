const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['low_stock', 'task_due', 'maintenance_due', 'cleaning_due'] },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);