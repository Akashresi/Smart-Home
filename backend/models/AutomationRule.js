const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true, index: true },
  name: { type: String, required: true },
  trigger: {
    type: { type: String, enum: ['time', 'sensor_value'], required: true },
    condition: { type: mongoose.Schema.Types.Mixed, required: true } 
    // for sensor_value: { deviceId: '...', operator: '>', threshold: 30 }
    // for time: { cronExpression: '0 8 * * *' } or simple time config
  },
  action: {
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmartDevice', required: true },
    command: { type: String, required: true }, // 'turn_on', 'turn_off', 'set_value'
    payload: { type: mongoose.Schema.Types.Mixed } // e.g. { value: 24 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AutomationRule', automationRuleSchema);
