const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  threshold: { type: Number, required: true, default: 1 }
}, { timestamps: true });

// Check low stock
inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.threshold;
};

module.exports = mongoose.model('Inventory', inventorySchema);
