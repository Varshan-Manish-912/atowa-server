import {Aedes} from "aedes";
import net from "net";

import { config } from "../config/env.js";

const broker = await Aedes.createBroker();

const mqttServer = net.createServer(broker.handle);

broker.on("client", (client) => {
    console.log(`[MQTT] Client Connected: ${client.id}`);
});

broker.on("clientDisconnect", (client) => {
    console.log(`[MQTT] Client Disconnected: ${client.id}`);
});

broker.on("subscribe", (subscriptions, client) => {
    console.log(`[MQTT] ${client?.id} subscribed.`);
});

broker.on("publish", (packet, client) => {
    if (client) {
        console.log(
            `[MQTT] ${client.id} published to ${packet.topic}`
        );
    }
});

export function startBroker() {
    mqttServer.listen(config.mqttPort, () => {
        console.log(`MQTT Broker listening on port ${config.mqttPort}`);
    });
}

export default broker;