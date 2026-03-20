const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');

exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    // Check if quantity decreased to auto-generate expense
    const oldItem = await Inventory.findById(req.params.id);
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (oldItem.quantity > item.quantity) {
      const usedAmount = oldItem.quantity - item.quantity;
      // create automatic expense entry (mock cost per item as $10 for example)
      await Expense.create({
        amount: usedAmount * 10,
        category: 'Inventory Usage',
        inventoryItemId: item._id
      });
    }

    if (item.isLowStock()) {
      // Trigger low stock alert here
      console.log(`Alert: ${item.itemName} is running low!`);
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
