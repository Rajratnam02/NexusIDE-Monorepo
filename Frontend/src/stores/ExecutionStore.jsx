import { create } from "zustand";
import { executeApi } from "../axios/AxiosInstance";

export const useExecutionStore = create((set) => ({
  isRunning:    false,
  output:       null,
  error:        null,
  isOutputOpen: false,

  runCode: async (language, code) => {
    if (!language || !code?.trim()) return;
    set({ isRunning: true, error: null, isOutputOpen: true });
    try {
      const { data } = await executeApi.post("/", { language, code });
      if (data.success) {
        set({ output: data.data, isRunning: false });
      } else {
        set({ error: data.message, output: null, isRunning: false });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to execute code. Please try again.";
      set({ error: message, output: null, isRunning: false });
    }
  },

  clearOutput:  () => set({ output: null, error: null }),
  toggleOutput: () => set((s) => ({ isOutputOpen: !s.isOutputOpen })),
  closeOutput:  () => set({ isOutputOpen: false }),
}));
