import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./AuthStore";
import { useProjectStore } from "./ProjectStore";
import { useChatStore } from "./ChatStore";       
import { useMemberStore } from "./MemberStore";


const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

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
        // --- Member Events ---
        case "MEMBER_JOINED":
          useMemberStore.getState().addMemberLocal(payload);
          set((state) => ({
            onlineUsers: [...state.onlineUsers, payload.user || payload],
          }));
          break;
        case "MEMBER_LEFT":
          useMemberStore.getState().removeMemberLocal(payload.userId || payload._id);
          set((state) => ({
            onlineUsers: state.onlineUsers.filter((u) => (u._id || u.id) !== (payload.userId || payload._id))
          }));
          break;
        case "ROLE_UPDATED":
          useMemberStore.getState().updateRoleLocal(payload.userId, payload.newRole);
          break;

        // --- File Events ---
        case "FILE_CREATED":
          useProjectStore.getState().addFileLocal(payload);
          break;
        case "FILE_DELETED": {
          const files = useProjectStore.getState().files;
          const target = files.find((f) => f.name === payload.fileName || f._id === payload.fileId);
          if (target) {
            useProjectStore.getState().removeFileLocal(target._id);
          }
          break;
        }
        case "FILE_UPDATED": {
          const files = useProjectStore.getState().files;
          const target = files.find((f) => f.name === payload.oldName || f._id === payload._id);
          if (target) {
            useProjectStore.getState().updateFileLocal({ 
              ...payload, 
              _id: target._id, 
              name: payload.newName || target.name 
            });
          }
          break;
        }

        // --- Chat Events ---
        case "RECEIVE_CHAT":
          useChatStore.getState().addMessageLocal(payload);
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
      set({ socket: null, isConnected: false, onlineUsers: [] });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineUsers: [] });
    }
  },

  sendMessage: (roomId, message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send-chat", { roomId, message });
    }
  }
}));