const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  linkedInventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
