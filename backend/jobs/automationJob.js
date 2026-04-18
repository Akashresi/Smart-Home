const cron = require('node-cron');
const AutomationRule = require('../models/AutomationRule');
const SmartDevice = require('../models/SmartDevice');
const DeviceHistory = require('../models/DeviceHistory');
const parser = require('cron-parser');

class AutomationEngine {
  constructor(io) {
    this.io = io;
    this.init();
  }

  init() {
    // Run every minute to check both time-based and sensor-based rules
    cron.schedule('* * * * *', async () => {
      try {
        await this.evaluateRules();
      } catch (err) {
        console.error('Automation Engine Error:', err);
      }
    });
    console.log('Automation Engine started.');
  }

  async evaluateRules() {
    const rules = await AutomationRule.find({ isActive: true });
    
    for (let rule of rules) {
      if (rule.trigger.type === 'sensor_value') {
        await this.evaluateSensorRule(rule);
      } else if (rule.trigger.type === 'time') {
        const interval = parser.parseExpression(rule.trigger.condition.cronExpression);
        const nextDiff = interval.next().getTime() - Date.now();
        // If the cron was expected to run within the last minute, execute it
        if (nextDiff < 0 && nextDiff > -60000) {
          await this.executeAction(rule);
        }
      }
    }
  }

  async evaluateSensorRule(rule) {
    const { condition } = rule.trigger;
    const device = await SmartDevice.findById(condition.deviceId);
    if (!device || device.value === undefined || device.value === null) return;

    let isTriggered = false;
    const numericValue = Number(device.value);
    const threshold = Number(condition.threshold);

    switch (condition.operator) {
      case '>': isTriggered = numericValue > threshold; break;
      case '<': isTriggered = numericValue < threshold; break;
      case '==': isTriggered = numericValue == threshold; break;
      case '>=': isTriggered = numericValue >= threshold; break;
      case '<=': isTriggered = numericValue <= threshold; break;
    }

    if (isTriggered) {
      await this.executeAction(rule);
    }
  }

  async executeAction(rule) {
    const targetDevice = await SmartDevice.findById(rule.action.deviceId);
    if (!targetDevice) return;

    let newStatus = targetDevice.status;
    let newValue = targetDevice.value;

    if (rule.action.command === 'turn_on') newStatus = 'on';
    else if (rule.action.command === 'turn_off') newStatus = 'off';
    else if (rule.action.command === 'toggle') newStatus = newStatus === 'on' ? 'off' : 'on';
    else if (rule.action.command === 'set_value' && rule.action.payload) {
      newValue = rule.action.payload.value;
    }

    // Do nothing if already in expected state
    if (targetDevice.status === newStatus && targetDevice.value === newValue) return;

    targetDevice.status = newStatus;
    targetDevice.value = newValue;
    targetDevice.lastSeen = new Date();
    await targetDevice.save();

    // Log history
    await DeviceHistory.create({
      deviceId: targetDevice._id,
      action: newStatus ? `status_${newStatus}` : 'value_changed',
      value: newValue || newStatus,
      userId: rule.householdId // using household ID for system automated tasks
    });

    // Broadcast to household
    if (this.io) {
      this.io.to(`household_${rule.householdId.toString()}`).emit('device:status_updated', {
        deviceId: targetDevice._id,
        status: newStatus,
        value: newValue,
        updatedBy: 'Automation Engine'
      });
    }
  }
}

module.exports = AutomationEngine;
