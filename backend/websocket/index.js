import { Server } from "socket.io";
import env from "../config/env.js";
import socketAuthMiddleware from "../middlewares/socket.middleware.js";
import session from "../config/session.js";
import { registerProjectHandlers } from "./project.handler.js";

console.log("Initializing socket server with CORS origin:", env.CLIENT_URL);

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [env.CLIENT_URL, "http://localhost:3000"],
      credentials: true,
    },
  });

  io.engine.use(session);
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    registerProjectHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export default initializeSocket;