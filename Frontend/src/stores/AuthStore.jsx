import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";


export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  listenToAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },

  

}));