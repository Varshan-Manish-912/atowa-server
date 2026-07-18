import http from "http";

import app from "./app.js";
import { config } from "./config/env.js";
import { startBroker } from "./broker/broker.js";
import { startSubscriber } from "./mqtt/subscriber.js";
import { initializeSocket } from "./socket/socket.js";

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(config.httpPort, () => {
    console.log(`HTTP Server running on port ${config.httpPort}`);
});

startBroker();
startSubscriber();