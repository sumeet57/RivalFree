import { createContext, useContext, useEffect } from "react";
import socket from "../api/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(socket);

export function SocketProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    // if (!user) {
    //   if (socket.connected) {
    //     socket.disconnect();
    //   }
    //   return;
    // }

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);