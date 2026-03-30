import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const LoggedIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate(); 
  const logout = async () => {
    console.log("LOGOUT CLICKED"); 
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <button
      onClick={logout}
      className="px-4 py-1.5 rounded-md cursor-pointer text-sm font-medium text-white hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
    >
      Log out
    </button>
  );
};

export default LoggedIn;
