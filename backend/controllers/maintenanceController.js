const Maintenance = require('../models/Maintenance');

exports.getMaintenance = async (req, res) => {
  try {
    const items = await Maintenance.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMaintenanceItem = async (req, res) => {
  try {
    const item = await Maintenance.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMaintenanceItem = async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMaintenanceItem = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
