const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminUid: { type: String, required: true },
  memberUids: [{ type: String }],
  inviteCode: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Household', householdSchema);