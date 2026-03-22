const Household = require('../models/Household');
const User = require('../models/User');

const createHousehold = async (req, res) => {
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const household = await Household.create({
      name: req.body.name,
      adminUid: req.user.uid,
      memberUids: [req.user.uid],
      inviteCode
    });
    await User.findOneAndUpdate({ uid: req.user.uid }, { householdId: household._id });
    res.status(201).json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const joinHousehold = async (req, res) => {
  try {
    const household = await Household.findOne({ inviteCode: req.body.inviteCode });
    if (!household) return res.status(404).json({ message: 'Invalid code' });
    
    if (!household.memberUids.includes(req.user.uid)) {
      household.memberUids.push(req.user.uid);
      await household.save();
    }
    await User.findOneAndUpdate({ uid: req.user.uid }, { householdId: household._id });
    res.json(household);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getMembers = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user || !user.householdId) return res.json([]);
    const members = await User.find({ householdId: user.householdId });
    res.json(members);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createHousehold, joinHousehold, getMembers };