import { Server } from "socket.io";

let io = null;

export function initializeSocket(httpServer) {

    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:3001",
                "https://atowa-central.vercel.app/"
            ],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`[Socket.IO] Client Connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`[Socket.IO] Client Disconnected: ${socket.id}`);
        });

    });

}

export function getIO() {

    return io;

}