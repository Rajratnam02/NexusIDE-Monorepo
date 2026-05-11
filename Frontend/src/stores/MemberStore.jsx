import { create } from "zustand";
import { projectMemberApi } from "../axios/AxiosInstance";

export const useMemberStore = create((set) => ({
  members: [],
  pendingRequests: [],
  blockedUsers: [],
  loading: false,
  error: null,

  // --- API Calls ---

  fetchMembers: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectMemberApi.get(`/${roomId}/members`);
      set({ members: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  fetchPendingRequests: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectMemberApi.get(`/${roomId}/pending`);
      set({ pendingRequests: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  fetchBlockedUsers: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectMemberApi.get(`/${roomId}/blocked`);
      set({ blockedUsers: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  joinProject: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/join`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      return false;
    }
  },

  leaveProject: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/leave`);
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  requestJoin: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/request`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      return false;
    }
  },

  cancelJoin: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/cancel`);
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      return false;
    }
  },

  acceptJoin: async (roomId, userId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectMemberApi.post(`/${roomId}/members/${userId}/accept`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((u) => u._id !== userId && u.userId !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  rejectJoin: async (roomId, userId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/members/${userId}/reject`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((u) => u._id !== userId && u.userId !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  addMember: async (roomId, emailOrId, role) => {
    try {
      set({ loading: true, error: null });
      // Depending on the backend this could be POST /:roomId/members/:userId/add or /:roomId/members/add
      await projectMemberApi.post(`/${roomId}/members/${emailOrId}/add`, { role, email: emailOrId });
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  removeMember: async (roomId, userId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.delete(`/${roomId}/members/${userId}`);
      set((state) => ({
        members: state.members.filter((m) => m._id !== userId && m.userId !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  changeRole: async (roomId, userId, newRole) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.patch(`/${roomId}/members/${userId}/role`, { role: newRole });
      set((state) => ({
        members: state.members.map((m) =>
          (m._id === userId || m.userId === userId) ? { ...m, role: newRole } : m
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  blockUser: async (roomId, userId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/members/${userId}/block`);
      set((state) => ({
        members: state.members.filter((m) => m._id !== userId && m.userId !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  unblockUser: async (roomId, userId) => {
    try {
      set({ loading: true, error: null });
      await projectMemberApi.post(`/${roomId}/members/${userId}/unblock`);
      set((state) => ({
        blockedUsers: state.blockedUsers.filter((u) => u._id !== userId && u.userId !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  // --- Local Modifiers (For Socket Updates) ---

  addMemberLocal: (member) => set((state) => ({ 
    members: [...state.members, member] 
  })),

  removeMemberLocal: (userId) => set((state) => ({
    members: state.members.filter((m) => m._id !== userId && m.userId !== userId)
  })),

  updateRoleLocal: (userId, newRole) => set((state) => ({
    members: state.members.map((m) =>
      (m._id === userId || m.userId === userId) ? { ...m, role: newRole } : m
    )
  })),

}));
