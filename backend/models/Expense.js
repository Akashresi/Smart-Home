const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  linkedInventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);