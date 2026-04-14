const mongoose = require('mongoose');

const devicePermissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartDevice',
    required: true,
    index: true
  },
  permissionLevel: {
    type: String,
    enum: ['read', 'control', 'admin'],
    default: 'read',
    required: true
  },
  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('DevicePermission', devicePermissionSchema);
