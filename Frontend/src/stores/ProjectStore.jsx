import { create } from "zustand";
import { projectFileApi, projectCoreApi } from "../api/axios";

export const useProjectStore = create((set) => ({
  project: null,
  files: [],
  loading: false,
  error: null,

  fetchProjectData: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await projectCoreApi.get(`/${roomId}`);
      set({ 
        project: response.data.project, 
        files: response.data.project.files, 
        loading: false 
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load project", loading: false });
    }
  },

 
  
  addFileLocal: (newFile) => {
    set((state) => ({
      files: [...state.files, newFile]
    }));
  },

  removeFileLocal: (fileName) => {
    set((state) => ({
      files: state.files.filter((f) => f.name !== fileName)
    }));
  },

  updateFileLocal: (payload) => {
    
    set((state) => ({
      files: state.files.map((f) => 
        f.name === payload.oldName 
          ? { ...f, name: payload.newName || f.name, content: payload.content ?? f.content } 
          : f
      )
    }));
  },



  createFile: async (name, language) => {
    try {
      const res = await projectFileApi.post("/create", { name, language });
     
      return res.data;
    } catch (err) {
      console.error("Creation error:", err);
      throw err;
    }
  },

  deleteFile: async (fileName) => {
    try {
      await projectFileApi.post("/delete", { fileName });
    } catch (err) {
      console.error("Delete error:", err);
    }
  },

  clearProject: () => set({ project: null, files: [], error: null })
}));