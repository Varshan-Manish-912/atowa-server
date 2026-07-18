import mqtt from "mqtt";
import { getIO } from "../socket/socket.js";
import { updateDevice, getDevice } from "../store/deviceStore.js";

export function startSubscriber() {
    const client = mqtt.connect("mqtt://localhost:1883");

    client.on("connect", () => {

        console.log("[MQTT] Subscriber Connected");

        client.subscribe("atowa/#", (err) => {

            if (err) {
                console.error("[MQTT] Subscription Failed", err);
                return;
            }

            console.log("[MQTT] Subscribed to atowa/#");
        });
    });

    client.on("message", async (topic, message) => {

        try {

            const payload = JSON.parse(message.toString());

            await updateDevice(payload);

            const device = await getDevice(payload.deviceId);

            const io = getIO();

            if (io && device) {

                io.emit("deviceUpdated", device);

            }

            console.log("================================");
            console.log(`Topic : ${topic}`);
            console.log(payload);
            console.log("Device state updated.");
            console.log("================================");

        }
        catch (err) {

            console.error("[MQTT] Failed to process message:", err);

        }

    });

    client.on("error", (err) => {
        console.error("[MQTT]", err);
    });

}