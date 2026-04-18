const express = require('express');
const router = express.Router();
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getInventory).post(protect, createInventoryItem);
router.route('/:id').put(protect, updateInventoryItem).delete(protect, authorize('admin', 'member'), deleteInventoryItem);

module.exports = router;