const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { uid, email, name } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, name });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
