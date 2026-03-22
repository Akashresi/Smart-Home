const mongoose = require('mongoose');

const cleaningSchema = new mongoose.Schema({
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  assignedUser: { type: String },
  status: { type: String, default: 'pending' },
  recurring: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cleaning', cleaningSchema);