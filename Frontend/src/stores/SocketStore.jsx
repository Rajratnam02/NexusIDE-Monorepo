import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";
import { useProjectStore } from "./projectStore"; 
import { useChatStore } from "./chatStore";       

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineMembers: [],

  
  connectSocket: (roomId) => {
    const { user, token } = useAuthStore.getState();
    if (!user || get().socket) return;

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      query: { roomId },
    });

    socketInstance.on("connect", () => {
      set({ socket: socketInstance, isConnected: true });
      console.log("Connected to Nexus Real-time Engine");
    });

    
    socketInstance.on("project-event", (event) => {
      const { type, payload } = event;

      switch (type) {
        
        case "MEMBER_JOINED":
          set((state) => ({
            onlineMembers: [...state.onlineMembers, payload.user],
          }));
          break;

       
        case "FILE_CREATED":
          useProjectStore.getState().addFileLocal(payload);
          break;
        case "FILE_DELETED":
          useProjectStore.getState().removeFileLocal(payload.fileName);
          break;
        case "FILE_UPDATED":
          useProjectStore.getState().updateFileLocal(payload);
          break;

        
        case "RECEIVE_CHAT":
          useChatStore.getState().addMessage(payload);
          break;
        case "MESSAGE_DELETED":
          useChatStore.getState().removeMessageLocal(payload.messageId);
          break;
        case "CHAT_CLEARED":
          useChatStore.getState().clearChatLocal();
          break;

        default:
          console.warn("Unhandled Socket Event:", type);
      }
    });

    socketInstance.on("disconnect", () => {
      set({ socket: null, isConnected: false, onlineMembers: [] });
    });
  },

  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineMembers: [] });
    }
  },

  
  sendMessage: (roomId, message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send-chat", { roomId, message });
    }
  }
}));