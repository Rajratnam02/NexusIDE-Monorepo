import { Code2, Copy, Play, Users, Settings } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExecutionStore } from "../stores/ExecutionStore";
import { useEditorStore } from "../stores/EditorStore";

const RoomNavbar = ({ theme, setTheme, getEditorContent }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { runCode, isRunning } = useExecutionStore();
  const activeFile = useEditorStore((s) => s.activeFile);

  const copyRoomId = () => navigator.clipboard.writeText(roomId);

  const handleRun = () => {
    if (!activeFile || isRunning) return;
    const code = getEditorContent ? getEditorContent() : (activeFile.content || "");
    runCode(activeFile.language || "javascript", code);
  };

  return (
    <div className="bg-[#0A0A0A] border-b border-gray-800 text-white px-3 sm:px-4 py-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 min-w-0">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer group shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-md group-hover:scale-105 transition-transform">
            <Code2 size={15} />
          </div>
          <p className="text-sm font-semibold tracking-tight">Nexus<span className="text-blue-500">IDE</span></p>
        </div>
        <div className="hidden sm:block h-4 w-px bg-gray-700" />
        <div className="flex items-center gap-2 bg-[#121212] border border-gray-700 px-2.5 py-1 rounded-md text-xs min-w-0">
          <span className="text-gray-400">Room</span>
          <span className="text-blue-400 truncate max-w-[100px] sm:max-w-[220px]">{roomId}</span>
          <Copy size={13} onClick={copyRoomId} className="cursor-pointer text-gray-400 hover:text-white transition-colors shrink-0" />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-[#121212] text-gray-300 text-xs px-2 py-1.5 rounded outline-none border border-gray-700 focus:border-gray-500 cursor-pointer transition-colors shrink-0">
          <option value="vs-dark">Dark Mode</option>
          <option value="light">Light Mode</option>
          <option value="hc-black">High Contrast</option>
          <option value="dracula">Dracula</option>
          <option value="monokai">Monokai</option>
          <option value="onedark">One Dark</option>
          <option value="nord">Nord</option>
          <option value="github-dark">Github Dark</option>
        </select>
        <button
          onClick={handleRun}
          disabled={!activeFile || isRunning}
          title={!activeFile ? "Open a file to run" : "Run code"}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors shrink-0 ${!activeFile || isRunning ? "bg-green-900 text-green-600 cursor-not-allowed opacity-60" : "bg-green-600 hover:bg-green-700 text-white"}`}
        >
          {isRunning ? (
            <svg className="animate-spin" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          ) : (
            <Play size={13} />
          )}
          <span className="hidden sm:inline">{isRunning ? "Running..." : "Run"}</span>
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-md transition-colors shrink-0"><Users size={16} /></button>
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-md transition-colors shrink-0"><Settings size={16} /></button>
      </div>
    </div>
  );
};

export default RoomNavbar;
