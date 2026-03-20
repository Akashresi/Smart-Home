const mongoose = require('mongoose');

const cleaningSchema = mongoose.Schema({
  type: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  assignedUser: { type: String },
  status: { type: String, enum: ['scheduled', 'completed'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Cleaning', cleaningSchema);
