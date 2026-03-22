const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    const existing = await User.findOne({ $or: [{ uid }, { email }] });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = await User.create({ uid, email, name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser };