/**
 * Security Management Module
 * Handles intrusion detection and anomaly alerts.
 */
const { sendNotification } = require('../backend/services/notificationService');
const { getDeviceState, updateDeviceState } = require('../backend/services/deviceService');

async function handleSecurityEvent(event) {
    const systemState = await getDeviceState('system_alarm');
    
    // Only process critical alerts if the system is armed
    if (systemState.mode === 'armed_away' || systemState.mode === 'armed_night') {
        
        if (event.type === 'motion_detected' && event.confidence > 0.85) {
            console.warn(`[Security] High confidence motion detected at ${event.location}!`);
            
            // Send urgent push notification
            await sendNotification('admin', `Security Alert: Motion detected at ${event.location}!`, { priority: 'high' });
            
            // Trigger local deterrents
            await triggerSiren(event.location);
        }
        
        if (event.type === 'door_opened') {
            console.warn(`[Security] Door opened at ${event.location} while system armed!`);
            await sendNotification('admin', `Security Alert: Perimeter breach at ${event.location}!`, { priority: 'critical' });
        }
    }
}

async function triggerSiren(location) {
    // Logic to activate sirens or flash lights
    console.log(`Activating alarm siren for zone: ${location}`);
    await updateDeviceState('main_siren', { status: 'on', volume: 100 });
}

module.exports = { handleSecurityEvent };
