const Household = require('../models/Household');
const User = require('../models/User');

const createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Household name is required' });
    }

    // Check if user already has a household
    const user = await User.findById(req.user._id);
    if (user.householdId) {
      return res.status(400).json({ message: 'User already belongs to a household' });
    }

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const household = await Household.create({
      name,
      adminId: req.user._id,
      memberIds: [req.user._id],
      inviteCode
    });

    // Set the creator's role to 'admin' and update householdId
    await User.findByIdAndUpdate(req.user._id, { 
      householdId: household._id, 
      role: 'admin' 
    });

    res.status(201).json(household);
  } catch (err) { 
    console.error('Create Household Error:', err);
    res.status(500).json({ message: err.message || 'Server error' }); 
  }
};

const joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const household = await Household.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!household) return res.status(404).json({ message: 'Invalid invite code' });
    
    // Check if user already in household
    const user = await User.findById(req.user._id);
    if (user.householdId && user.householdId.toString() !== household._id.toString()) {
       return res.status(400).json({ message: 'User already belongs to another household' });
    }

    if (!household.memberIds.includes(req.user._id)) {
      household.memberIds.push(req.user._id);
      await household.save();
    }

    await User.findByIdAndUpdate(req.user._id, { householdId: household._id });
    res.json(household);
  } catch (err) { 
    console.error('Join Household Error:', err);
    res.status(500).json({ message: 'Server error' }); 
  }
};

const getInviteCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.householdId) {
      return res.status(400).json({ message: 'User does not belong to a household' });
    }
    const household = await Household.findById(user.householdId);
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    res.json({ code: household.inviteCode });
  } catch (err) {
    console.error('Get Invite Code Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMembers = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.householdId) return res.json([]);
    const members = await User.find({ householdId: user.householdId });
    res.json(members);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const userToRemove = await User.findById(memberId);
    if (!userToRemove) return res.status(404).json({ message: 'User not found' });

    const household = await Household.findById(req.user.householdId);
    household.memberIds = household.memberIds.filter(id => id.toString() !== memberId);
    await household.save();

    userToRemove.householdId = null;
    await userToRemove.save();

    res.json({ message: 'Member removed successfully' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const updateMemberRole = async (req, res) => {
  try {
    const { memberId, role } = req.body;
    await User.findByIdAndUpdate(memberId, { role });
    res.json({ message: 'Role updated successfully' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { 
  createHousehold, 
  joinHousehold, 
  getInviteCode,
  getMembers, 
  removeMember, 
  updateMemberRole 
};