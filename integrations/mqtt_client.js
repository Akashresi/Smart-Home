/**
 * MQTT Integration
 * Manages the connection to the MQTT broker for real-time device communication.
 */
const mqtt = require('mqtt');
const { handleDeviceTelemetry } = require('../backend/controllers/deviceController');

class MqttIntegration {
    constructor(brokerUrl) {
        this.client = mqtt.connect(brokerUrl, {
            reconnectPeriod: 5000,
            clientId: `smarthome_backend_${Math.random().toString(16).slice(2, 8)}`
        });
        
        this.client.on('connect', this.onConnect.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('error', this.onError.bind(this));
    }

    onConnect() {
        console.log("[MQTT] Successfully connected to broker");
        // Subscribe to all device telemetry topics
        this.client.subscribe('smarthome/devices/+/telemetry', (err) => {
            if (err) console.error("[MQTT] Subscription error:", err);
            else console.log("[MQTT] Subscribed to telemetry topics");
        });
    }

    onMessage(topic, message) {
        try {
            const topicParts = topic.split('/');
            const deviceId = topicParts[2];
            const payload = JSON.parse(message.toString());
            
            // Route data to the central device controller for processing
            handleDeviceTelemetry(deviceId, payload);
        } catch (error) {
            console.error(`[MQTT] Error parsing message on topic ${topic}:`, error);
        }
    }
    
    onError(error) {
        console.error("[MQTT] Connection error:", error);
    }
    
    publishCommand(deviceId, command) {
        const topic = `smarthome/devices/${deviceId}/set`;
        this.client.publish(topic, JSON.stringify(command));
    }
}

module.exports = MqttIntegration;
