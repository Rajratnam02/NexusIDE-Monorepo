import { Server } from "socket.io";
import admin from "../config/firebase.config.js";
import { YSocketIO } from "y-socket.io/dist/server";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { 
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    },
  });

  // Yjs document sync via y-socket.io (no auth required — room namespaced per file)
  const ysocketio = new YSocketIO(io, {
    gcEnabled: true,
  });
  ysocketio.initialize();

  io.use(async (socket, next) => {
    // Skip auth middleware for y-socket.io namespace
    if (socket.nsp.name.startsWith("/yjs")) return next();
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
