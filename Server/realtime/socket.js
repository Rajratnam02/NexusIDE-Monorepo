import { Server } from "socket.io";
import admin from "../config/firebase.config.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = await admin.auth().verifyIdToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      console.log("User left");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized. Please call initSocket(server) first.",
    );
  }
  return io;
};
