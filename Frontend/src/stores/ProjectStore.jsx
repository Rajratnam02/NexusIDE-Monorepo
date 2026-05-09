import { create } from "zustand";
import { projectCoreApi, projectFileApi } from "../axios/AxiosInstance";

export const useProjectStore = create((set) => ({
  currentProject: null,
  files: [],
  myProjects: [],
  publicProjects: [],
  loading: false,
  error: null,

  // Core API Functions
  createProject: async (name) => {
    try {
      set({ loading: true, error: null });
      const response = await projectCoreApi.post("/", { name });
      set({ currentProject: response.data.data, loading: false });
      console.log("Success");
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      throw error;
    }
  },

  fetchMyProjects: async () => {
    try {
      set({ loading: true, error: null });
      const response = await projectCoreApi.get("/my-project");
      set({ myProjects: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  fetchAllProjects: async () => {
    try {
      set({ loading: true, error: null });
      const response = await projectCoreApi.get("/");
      set({ publicProjects: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  fetchProjectDetails: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectCoreApi.get(`/${roomId}/details`);
      set({ currentProject: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  updateProject: async (roomId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await projectCoreApi.patch(`/${roomId}`, data);
      set({ currentProject: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  deleteProject: async (roomId) => {
    try {
      set({ loading: true, error: null });
      await projectCoreApi.delete(`/${roomId}`);
      set({ currentProject: null, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  // Files API Functions
  fetchFiles: async (roomId) => {
    try {
      set({ loading: true, error: null });
      const response = await projectFileApi.get(`/${roomId}/files`);
      set({ files: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
    }
  },

  createFile: async (roomId, name, language) => {
    try {
      set({ loading: true, error: null });
      const response = await projectFileApi.post(`/${roomId}/files`, { name, language });
      set((state) => ({ files: [...state.files, response.data.data], loading: false }));
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      throw error;
    }
  },

  deleteFile: async (roomId, fileId) => {
    try {
      set({ loading: true, error: null });
      await projectFileApi.delete(`/${roomId}/files/${fileId}`);
      set((state) => ({
        files: state.files.filter((f) => f._id !== fileId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      throw error;
    }
  },

  renameFile: async (roomId, fileId, newName) => {
    try {
      set({ loading: true, error: null });
      const response = await projectFileApi.patch(`/${roomId}/files/${fileId}`, { name: newName });
      set((state) => ({
        files: state.files.map((f) => f._id === fileId ? response.data.data : f),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      console.log(error);
      throw error;
    }
  },

  saveFileContent: async (roomId, fileId, content) => {
    try {
      const response = await projectFileApi.patch(`/${roomId}/files/${fileId}`, { content });
      set((state) => ({
        files: state.files.map((f) => f._id === fileId ? response.data.data : f),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      console.log(error);
      throw error;
    }
  },

  // Local Modifiers (For Socket Updates)
  addFileLocal: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFileLocal: (fileId) => set((state) => ({ files: state.files.filter((f) => f._id !== fileId) })),
  updateFileLocal: (payload) => set((state) => ({
    files: state.files.map((f) => f._id === payload._id ? { ...f, ...payload } : f)
  })),
}));