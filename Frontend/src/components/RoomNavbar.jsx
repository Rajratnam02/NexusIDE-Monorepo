import { Code2, Copy, Play, Users, Settings } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoomNavbar = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="h-12 bg-[#0A0A0A] border-b border-gray-800 flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-5">
        <div
          onClick={() => {
            navigate("/");
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-blue-600 p-1.5 rounded-md group-hover:scale-105">
            <Code2 size={15} />
          </div>
          <p className="text-sm font-semibold tracking-tight">
            Nexus<span className="text-blue-500">IDE</span>
          </p>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        <div className="flex items-center gap-2 bg-[#121212] border border-gray-700 px-2.5 py-1 rounded-md text-xs">
          <span className="text-gray-400">Room</span>
          <span className="text-blue-400">{roomId}</span>
          <Copy
            size={13}
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={copyRoomId}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded-md">
          <Play size={13} />
          Run
        </button>

        <button className="p-1.5 hover:bg-[#1A1A1A] rounded-md">
          <Users size={16} />
        </button>

        <button className="p-1.5 hover:bg-[#1A1A1A] rounded-md">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoomNavbar;
