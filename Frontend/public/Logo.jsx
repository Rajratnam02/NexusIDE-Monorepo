import { Code2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 justify-center group">
      <div
        onClick={() => navigate("/")}
        className="p-3 bg-blue-600 group-hover:rotate-12 transition-transform duration-500 w-fit rounded-2xl cursor-pointer shadow-lg shadow-blue-600/20"
      >
        <Code2 className="text-white w-6 h-6" />
      </div>
      <p
        onClick={() => navigate("/")}
        className="text-white text-2xl cursor-pointer tracking-tighter font-bold"
      >
        Nexus<span className="text-blue-600">IDE</span>
      </p>
    </div>
  );
};

export default Logo;
