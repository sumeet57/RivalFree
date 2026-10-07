import { io } from "socket.io-client";

const origin = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const socket = io(origin, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

export default socket;