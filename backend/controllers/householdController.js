const Household = require('../models/Household');
const User = require('../models/User');

const createHousehold = async (req, res) => {
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const household = await Household.create({
      name: req.body.name,
      adminId: req.user._id,
      memberIds: [req.user._id],
      inviteCode
    });
    // Set the creator's role to 'admin'
    await User.findByIdAndUpdate(req.user._id, { householdId: household._id, role: 'admin' });
    res.status(201).json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const joinHousehold = async (req, res) => {
  try {
    const household = await Household.findOne({ inviteCode: req.body.inviteCode });
    if (!household) return res.status(404).json({ message: 'Invalid code' });
    
    if (!household.memberIds.includes(req.user._id)) {
      household.memberIds.push(req.user._id);
      await household.save();
    }
    await User.findByIdAndUpdate(req.user._id, { householdId: household._id });
    res.json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getMembers = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.householdId) return res.json([]);
    const members = await User.find({ householdId: user.householdId });
    res.json(members);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createHousehold, joinHousehold, getMembers };