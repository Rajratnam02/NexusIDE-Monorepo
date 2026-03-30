import { Code2 } from "lucide-react";
import React from "react";
import { useAuthStore } from "../stores/authStore";
import LoggedOut from "./LoggedOut";
import LoggedIn from "./LoggedIn";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <Code2 size={24} className="text-white" />
        </div>
        <p className="text-xl tracking-tight font-bold">
          Nexus<span className="text-blue-600">IDE</span>
        </p>
      </div>

      {user ? <LoggedIn /> : <LoggedOut />}
    </div>
  );
};

export default Navbar;
