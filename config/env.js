import dotenv from "dotenv";

dotenv.config();

export const config = {
    httpPort: process.env.HTTP_PORT || 3000,
    mqttPort: process.env.MQTT_PORT || 1883,
};