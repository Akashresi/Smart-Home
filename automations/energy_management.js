/**
 * Energy Management Module
 * Automates the optimization of power consumption based on presence and historical usage.
 */
const { getDevices, updateDeviceState } = require('../backend/services/deviceService');
const { getSensorData } = require('../backend/services/sensorService');

async function optimizeEnergy() {
    console.log("Running energy management optimization...");
    
    try {
        const sensors = await getSensorData('presence');
        const lights = await getDevices('light');
        const hvac = await getDevices('thermostat');
        
        const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
        
        for (const sensor of sensors) {
            // Check if room has been unoccupied for the timeout duration
            if (!sensor.isActive && (Date.now() - sensor.lastActive > IDLE_TIMEOUT_MS)) {
                
                // Turn off lights in empty rooms
                const roomLights = lights.filter(l => l.roomId === sensor.roomId && l.status === 'on');
                for (const light of roomLights) {
                    await updateDeviceState(light.id, { status: 'off' });
                    console.log(`[Energy Mgmt] Turned off light ${light.id} in room ${sensor.roomId}`);
                }
                
                // Set HVAC to Eco mode in empty rooms
                const roomHvac = hvac.find(h => h.roomId === sensor.roomId && h.mode !== 'eco');
                if (roomHvac) {
                     await updateDeviceState(roomHvac.id, { mode: 'eco', targetTemp: 24 });
                     console.log(`[Energy Mgmt] Set HVAC ${roomHvac.id} to Eco mode in room ${sensor.roomId}`);
                }
            }
        }
    } catch (error) {
        console.error("Failed to execute energy management routine:", error);
    }
}

module.exports = { optimizeEnergy };
