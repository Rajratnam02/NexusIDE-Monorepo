import React from "react";
import { useNavigate } from "react-router-dom";

const LoggedOut = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-6 text-sm">
      <button
        onClick={() => navigate("/login")}
        className="font-medium text-gray-200 hover:text-blue-400 transition-colors"
      >
        Log in
      </button>

      <button
        onClick={() => navigate("/register")}
        className="px-5 py-2 rounded-full font-semibold 
                   bg-blue-600 text-white 
                   hover:bg-blue-500 active:scale-95 
                   transition-all duration-200 shadow-md hover:shadow-blue-500/30"
      >
        Get Started
      </button>
    </div>
  );
};

export default LoggedOut;
