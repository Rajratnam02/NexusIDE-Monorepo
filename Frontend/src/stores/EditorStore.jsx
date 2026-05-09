import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  activeFile: null,
  openTabs: [],
  editorTheme: "vs-dark",
  isSaving: false,

  setActiveFile: (file) => {
    const { openTabs } = get();
    
    const identifier = file._id || file.name;
    const isAlreadyOpen = openTabs.find((f) => (f._id || f.name) === identifier);

    if (!isAlreadyOpen) {
      set({
        openTabs: [...openTabs, file],
        activeFile: file,
      });
    } else {
      set({ activeFile: file });
    }
  },

  closeTab: (fileIdentifier) => {
    const { openTabs, activeFile } = get();
    const updatedTabs = openTabs.filter((f) => (f._id || f.name) !== fileIdentifier);
    let nextActive = activeFile;
    if (activeFile && (activeFile._id || activeFile.name) === fileIdentifier) {
      nextActive = updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1] : null;
    }

    set({
      openTabs: updatedTabs,
      activeFile: nextActive,
    });
  },

  updateActiveFileContentLocal: (content) => {
    const { activeFile, openTabs } = get();
    if (!activeFile) return;

    const updatedActive = { ...activeFile, content };
    
    const updatedTabs = openTabs.map((f) =>
      (f._id || f.name) === (activeFile._id || activeFile.name) ? updatedActive : f
    );

    set({
      activeFile: updatedActive,
      openTabs: updatedTabs,
    });
  },

  setTheme: (themeName) => {
    set({ editorTheme: themeName });
  },

  setIsSaving: (status) => {
    set({ isSaving: status });
  },

  updateFileLocal: (payload) => {
    const { openTabs, activeFile } = get();

    const fileIdentifier = payload.oldName || payload._id;
    if (!fileIdentifier) return;

    const updatedTabs = openTabs.map((f) => {
      if ((f._id || f.name) === fileIdentifier) {
        return { ...f, ...payload, name: payload.newName || payload.name || f.name };
      }
      return f;
    });

    let updatedActive = activeFile;
    if (activeFile && (activeFile._id || activeFile.name) === fileIdentifier) {
      updatedActive = { ...activeFile, ...payload, name: payload.newName || payload.name || activeFile.name };
    }

    set({ openTabs: updatedTabs, activeFile: updatedActive });
  },

  clearEditor: () => set({ activeFile: null, openTabs: [], isSaving: false }),
}));
