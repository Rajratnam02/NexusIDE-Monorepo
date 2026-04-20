import { Search } from "lucide-react";
import React from "react";
import { useAuthStore } from "../stores/authStore";

const DashboardNavbar = () => {
  const user = useAuthStore((state) => state.user);


  const getValidPhoto = () => {
    if (!user) return null;

    const rawPhoto = user.photoURL || user.providerData?.[0]?.photoURL;

    if (!rawPhoto || rawPhoto.includes("/picture/0")) return null;

    return rawPhoto.replace("http://", "https://");
  };

  const userPhoto = getValidPhoto();

  return (
    <div className="border-b border-gray-800 w-full h-16 flex items-center justify-between bg-black/50 backdrop-blur-sm">
      {/* Search Bar */}
      <div className="flex items-center border pl-3 py-2 border-gray-800 rounded-lg bg-[#111111] ml-10 gap-4">
        <Search className="text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full bg-[#111111] pr-30 text-sm text-gray-200 focus:border-blue-500/50 outline-none transition-all"
        />
      </div>

      {/* User Profile / Avatar */}
      <div
        className="h-9 w-9 mr-8 rounded-full overflow-hidden border border-blue-700 
                   flex items-center justify-center bg-gray-800 text-white font-semibold"
      >
        {userPhoto ? (
          <img
            src={userPhoto}
            alt="User avatar"
            className="h-full w-full object-cover"
            
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = ""; 
              e.target.parentElement.innerHTML = `<span>${user?.displayName?.charAt(0).toUpperCase() || "U"}</span>`;
            }}
          />
        ) : (
          <span className="text-sm">
            {user?.displayName?.charAt(0)?.toUpperCase() || 
             user?.email?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;