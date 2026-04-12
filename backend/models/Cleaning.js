const mongoose = require('mongoose');

const cleaningSchema = new mongoose.Schema({
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  recurring: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  status: { type: String, enum: ['scheduled', 'in_progress', 'completed'], default: 'scheduled' },
  userId: { type: String, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Cleaning', cleaningSchema);