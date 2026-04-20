import { create } from "zustand";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../configs/firebase";


export const useAuthStore = create((set) => ({
  user: null,
  token: null, 
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  listenToAuth: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        set({ user, token, loading: false });
      } else {
        set({ user: null, token: null, loading: false });
      }
    });
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, token: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));