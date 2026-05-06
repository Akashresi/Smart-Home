const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Load backend/.env

const unlockAllUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/smarthome');
    const result = await User.updateMany({}, { 
        $set: { loginAttempts: 0 }, 
        $unset: { lockUntil: 1 } 
    });
    console.log(`Unlocked ${result.modifiedCount} user(s).`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

unlockAllUsers();
