import {
  Search,
  LogOut,
  Menu,
} from "lucide-react";

import React from "react";
import { useAuthStore } from "../stores/AuthStore";

const DashboardNavbar = ({ setClosed }) => {

  const { user, logout } = useAuthStore();

  const getValidPhoto = () => {
    if (!user) return null;

    const rawPhoto =
      user.photoURL ||
      user.providerData?.[0]?.photoURL;

    if (
      !rawPhoto ||
      rawPhoto.includes("/picture/0")
    ) {
      return null;
    }

    return rawPhoto.replace(
      "http://",
      "https://"
    );
  };

  const userPhoto = getValidPhoto();

  return (
    <nav className="border-b border-gray-800 w-full bg-black/50 backdrop-blur-sm">

      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 flex-1">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setClosed(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex items-center border border-gray-800 rounded-lg bg-[#111111] px-3 py-2 gap-3 flex-1 max-w-md">

            <Search
              className="text-gray-500 shrink-0"
              size={16}
            />

            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-500"
            />

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">

          {/* Avatar */}
          <div
            className="
              h-9
              w-9
              rounded-full
              overflow-hidden
              border
              border-blue-700
              flex
              items-center
              justify-center
              bg-gray-800
              text-white
              font-semibold
            "
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="avatar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <span className="text-sm">
                {user?.displayName
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  user?.email
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
          >

            <LogOut size={20} />

          </button>

        </div>

      </div>

    </nav>
  );
};

export default DashboardNavbar;