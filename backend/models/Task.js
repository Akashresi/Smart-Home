const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['task', 'cleaning'], default: 'task' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  date: { type: Date, default: Date.now },
  userId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
