const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');

const getInventory = async (req, res) => {
  try {
    const inv = await Inventory.find({ userId: req.user.uid });
    res.json(inv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const oldItem = await Inventory.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!oldItem) return res.status(404).json({ message: 'Inventory item not found' });
    
    const usedAmount = oldItem.quantity - (req.body.quantity || oldItem.quantity);
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    
    if (usedAmount > 0) {
      const cost = usedAmount * (oldItem.unitCost || 0);
      if (cost > 0) {
        await Expense.create({
          amount: cost,
          category: 'Supplies',
          linkedInventoryItem: item._id,
          userId: req.user.uid
        });
      }
    }
    
    if (item.isLowStock()) {
      await Alert.create({
        type: 'low_stock',
        message: `${item.itemName} is reaching low stock (Current: ${item.quantity})`,
        userId: req.user.uid
      });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const result = await Inventory.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Inventory item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem };