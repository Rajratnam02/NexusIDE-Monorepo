import { Clock, Code2, Folder, LogOut, Settings, User } from "lucide-react";

import React from "react";
import SidebarButton from "./SidebarButton";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";

const Sidebar = ({ selected, setSelected, closed, setClosed }) => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const clickHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!closed && (
        <div
          onClick={() => setClosed(true)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen
          w-[280px]
          bg-[#0A0A0A]
          border-r border-gray-800

          flex flex-col justify-between

          transition-transform duration-300

          ${closed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Top */}
        <div className="mx-5 flex flex-col">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex gap-2 items-center cursor-pointer mt-8 md:mt-10"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg hover:rotate-12 transition-transform w-fit">
              <Code2 size={24} />
            </div>

            <p className="text-xl tracking-tight font-bold text-white">
              Nexus
              <span className="text-blue-600">IDE</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-2">
            <SidebarButton
              icon={<Folder />}
              title="Projects"
              selected={selected}
              setSelected={setSelected}
            />

            <SidebarButton
              icon={<User />}
              title="Shared with me"
              selected={selected}
              setSelected={setSelected}
            />

            <SidebarButton
              icon={<Clock />}
              title="Recent"
              selected={selected}
              setSelected={setSelected}
            />

            <SidebarButton
              icon={<Settings />}
              title="Settings"
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={clickHandler}
          className="flex items-center px-6 md:px-8 gap-3 border-t border-gray-800 text-gray-400 hover:text-red-400 transition-colors py-5 text-sm w-full"
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
