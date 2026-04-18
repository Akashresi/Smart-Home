const SmartDevice = require('../models/SmartDevice');
const DeviceHistory = require('../models/DeviceHistory');

const getDevices = async (req, res) => {
  try {
    if (!req.user.householdId) return res.json([]);
    const devices = await SmartDevice.find({ householdId: req.user.householdId });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDevice = async (req, res) => {
  try {
    const { status, value } = req.body;
    const device = await SmartDevice.findOne({ _id: req.params.id, householdId: req.user.householdId });
    
    if (!device) return res.status(404).json({ message: 'Device not found' });

    device.status = status !== undefined ? status : device.status;
    device.value = value !== undefined ? value : device.value;
    device.lastSeen = Date.now();
    await device.save();

    // Log history
    await DeviceHistory.create({
      deviceId: device._id,
      action: status ? `status_${status}` : 'value_changed',
      value: value || status,
      userId: req.user._id
    });

    // Notify other users in household via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`household_${req.user.householdId.toString()}`).emit('device:status_updated', {
        deviceId: device._id,
        status: device.status,
        value: device.value,
        updatedBy: req.user.name
      });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createDevice = async (req, res) => {
    try {
        const device = await SmartDevice.create({
            ...req.body,
            householdId: req.user.householdId
        });
        res.status(201).json(device);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getDevices, updateDevice, createDevice };
