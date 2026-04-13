const User = require('../models/User');

const registerUser = async (req, res) => {
  // req.body now comes from PocketBase registration response
  const { id, email, name } = req.body; // id = PocketBase record id
  try {
    let user = await User.findOne({ uid: id });
    if (!user) {
      user = await User.create({ uid: id, email, name });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { registerUser };