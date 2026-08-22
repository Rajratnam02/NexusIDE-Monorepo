import { Server } from "socket.io";
import admin from "../config/firebase.config.js";
import { YSocketIO } from "y-socket.io/dist/server";
import { MongodbPersistence } from "y-mongodb-provider";
import * as Y from "yjs";

let io;
let mdb;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { 
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    },
  });

  // Initialize Yjs MongoDB Persistence
  mdb = new MongodbPersistence(process.env.MONGO_URI, {
    collectionName: "yjs_documents",
  });

  // Yjs document sync via y-socket.io (no auth required — room namespaced per file)
  const ysocketio = new YSocketIO(io, {
    gcEnabled: true,
  });

  // Load document from MongoDB when a room is loaded (rehydrate state)
  ysocketio.on("document-loaded", async (doc) => {
    try {
      const persistedYdoc = await mdb.getYDoc(doc.name);
      const persistedState = Y.encodeStateAsUpdate(persistedYdoc);
      Y.applyUpdate(doc, persistedState);
    } catch (err) {
      console.error(`❌ Yjs database rehydration error for doc ${doc.name}:`, err);
    }
  });

  // Persist document updates to MongoDB in real-time
  ysocketio.on("document-update", async (doc, update) => {
    try {
      await mdb.storeUpdate(doc.name, update);
    } catch (err) {
      console.error(`❌ Yjs database save error for doc ${doc.name}:`, err);
    }
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

// Export getPersistedYDoc helper to retrieve the Yjs document from MongoDB
export const getPersistedYDoc = async (roomName) => {
  if (!mdb) return null;
  return await mdb.getYDoc(roomName);
};
