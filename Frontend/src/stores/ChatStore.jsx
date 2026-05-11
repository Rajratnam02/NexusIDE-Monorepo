import { create } from "zustand";
import { messageApi } from "../axios/AxiosInstance";

export const useChatStore = create((set) => ({
  messages: [],
  loading: false,
  error: null,

  // --- API Calls ---

  fetchMessages: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await messageApi.get(`/${roomId}`);
      set({ messages: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  sendMessage: async (roomId, content) => {
    try {
      set({ error: null });
      // Provide both content and message keys since backends often vary.
      await messageApi.post(`/${roomId}`, { content, message: content });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      console.log(error);
    }
  },

  deleteMessage: async (roomId, messageId) => {
    try {
      set({ error: null });
      await messageApi.delete(`/${roomId}/${messageId}`);
      // Usually socket will fire MESSAGE_DELETED to all clients including sender,
      // but we can also aggressively remove it locally if we want. Let's rely on socket for consistency.
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      console.log(error);
    }
  },

  clearProjectChat: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await messageApi.delete(`/${roomId}`);
      // Usually socket will fire CHAT_CLEARED
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  // --- Local Modifiers (For Socket Updates) ---

  addMessageLocal: (message) => set((state) => {
    // Avoid duplicates by checking message ID
    const exists = state.messages.find(m => (m._id || m.id) === (message._id || message.id));
    if (exists) return state;
    return { messages: [...state.messages, message] };
  }),

  removeMessageLocal: (messageId) => set((state) => ({
    messages: state.messages.filter((m) => (m._id || m.id) !== messageId)
  })),

  clearChatLocal: () => set({
    messages: []
  }),
}));
