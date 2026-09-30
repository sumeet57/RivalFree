import { Server } from "socket.io";
import { env } from "../config/env.js";
import socketAuthMiddleware from "../middlewares/socket.middleware.js";
import { registerProjectHandlers } from "./project.handler.js";
import { registerFeatureHandlers } from "./feature.handler.js";
import { configureSession } from "../config/session.js";

console.log("Initializing socket server with CORS origin:", env.CLIENT_URL);

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [env.CLIENT_URL, "http://localhost:3000"],
      credentials: true,
    },
  });

  io.engine.use(configureSession());
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    registerProjectHandlers(io, socket);
    registerFeatureHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export default initializeSocket;