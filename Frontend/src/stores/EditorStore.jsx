import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  activeFile: null,
  openFiles: [],
  isSaving: false,

  setActiveFile: (file) => {
    const { openFiles } = get();
    const isAlreadyOpen = openFiles.find((f) => f.name === file.name);

    if (!isAlreadyOpen) {
      set({
        openFiles: [...openFiles, file],
        activeFile: file,
      });
    } else {
      set({ activeFile: file });
    }
  },

  closeFile: (fileName) => {
    const { openFiles, activeFile } = get();
    const updatedTabs = openFiles.filter((f) => f.name !== fileName);

    let nextActive = activeFile;

    if (activeFile?.name === fileName) {
      nextActive =
        updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : null;
    }

    set({
      openFiles: updatedTabs,
      activeFile: nextActive,
    });
  },

  updateFileLocal: (payload) => {
    const { openFiles, activeFile } = get();

    const updatedTabs = openFiles.map((f) =>
      f.name === payload.oldName ? { ...f, name: payload.newName } : f,
    );

    let updatedActive = activeFile;
    if (activeFile?.name === payload.oldName) {
      updatedActive = { ...activeFile, name: payload.newName };
    }

    set({ openFiles: updatedTabs, activeFile: updatedActive });
  },

  setSaving: (status) => set({ isSaving: status }),

  clearEditor: () => set({ activeFile: null, openFiles: [] }),
}));
