const express = require('express');
const router = express.Router();
const { getDevices, updateDevice, createDevice } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDevices);
router.post('/', createDevice);
router.put('/:id', updateDevice);

module.exports = router;
