# System Architecture

The Smart Home Ecosystem is designed using a multi-tiered architecture to ensure separation of concerns, scalability, and robust performance.

## Layers

### 1. IoT Devices Layer (Hardware)
The physical edge of the network. This includes sensors (temperature, motion, door/window contacts), actuators (smart plugs, locks, valves), lights, and IP cameras. These devices operate on various physical layers and protocols like Wi-Fi, Zigbee, or Z-Wave.

### 2. Communication Layer (Messaging)
The conduit between the physical devices and the processing backend.
- **MQTT Broker:** Serves as the primary low-latency message bus for telemetry data and command distribution.
- **Zigbee2MQTT:** A translation bridge that allows Zigbee devices to communicate over the standard MQTT protocol, ensuring vendor neutrality.

### 3. Processing Layer (Backend)
The core logic and intelligence of the system.
- **Node.js/Express Server:** Manages business logic, REST APIs for the frontend, user authentication, and data persistence routing.
- **AI/Automation Engine:** A dedicated microservice (e.g., Python/FastAPI) that consumes state changes to trigger automated workflows, perform machine learning for anomaly detection, and provide intelligent recommendations.
- **Database:** Stores historical telemetry, user configurations, and automation rules (e.g., MongoDB for flexibility or PostgreSQL/TimescaleDB for time-series data).

### 4. Application Layer (Frontend)
The user-facing interface for interacting with the system.
- **React Native / Expo App:** Provides a responsive, cross-platform mobile and web dashboard. It utilizes WebSockets (Socket.IO) for real-time state synchronization with the backend, ensuring the UI always reflects the current state of the home without polling.
