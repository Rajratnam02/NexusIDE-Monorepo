import React, { useState, useEffect } from "react";
import RoomNavbar from "../components/RoomNavbar";
import RoomSidebar from "../components/RoomSidebar";
import { Editor, useMonaco } from "@monaco-editor/react";
import {
  draculaTheme,
  githubDarkTheme,
  monokaiProTheme,
  nordTheme,
  oneDarkTheme,
} from "../components/Themes";
import { useLocation, useParams } from "react-router-dom";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";
import { useSocketStore } from "../stores/SocketStore";
import { useProjectStore } from "../stores/ProjectStore";
import { useEditorStore } from "../stores/EditorStore";
import { useAuthStore } from "../stores/AuthStore";
import { useMemberStore } from "../stores/MemberStore";
import { X } from "lucide-react";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F333FF",
  "#33FFF3",
  "#FFD133",
];

const Room = () => {
  
  const connectSocket = useSocketStore((state) => state.connectSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);
  const [theme, setTheme] = useState("vs-dark");
  const { roomId } = useParams();
  const location = useLocation();
  const monaco = useMonaco();

  const [editor, setEditor] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  const { user } = useAuthStore();
  const { joinProject, requestJoin, cancelJoin } = useMemberStore();

  const [userName] = useState(
    () => user?.name || `User-${Math.floor(Math.random() * 1000)}`
  );
  const [myColor] = useState(
    () => COLORS[Math.floor(Math.random() * COLORS.length)],
  );

  const { currentProject, fetchProjectDetails, loading: projectLoading } = useProjectStore();
  const { activeFile, openTabs, setActiveFile, closeTab } = useEditorStore();

  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetchProjectDetails(roomId);
    }
  }, [roomId, fetchProjectDetails]);

  const isMember = currentProject?.members?.some(
    (m) => user?.email && (m.user?.email === user.email || m.email === user.email)
  );
  
  const hasRequested = currentProject?.requests?.some(
    (req) => req.email === user?.email
  );

  const handleJoin = async () => {
    const success = await joinProject(roomId);
    if (success) fetchProjectDetails(roomId);
  };

  const handleRequest = async () => {
    const success = await requestJoin(roomId);
    if (success) fetchProjectDetails(roomId);
  };

  const handleCancelRequest = async () => {
    const success = await cancelJoin(roomId);
    if (success) fetchProjectDetails(roomId);
  };

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("dracula", draculaTheme);
      monaco.editor.defineTheme("monokai", monokaiProTheme);
      monaco.editor.defineTheme("onedark", oneDarkTheme);
      monaco.editor.defineTheme("nord", nordTheme);
      monaco.editor.defineTheme("github-dark", githubDarkTheme);
    }
  }, [monaco]);

  // 1. Setup Ydoc and SocketIO Provider (y-socket.io talks to our own server)
  useEffect(() => {
    if (!roomId || !isMember) return;

    const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const doc = new Y.Doc();
    const prov = new SocketIOProvider(SOCKET_URL, `nexus-${roomId}`, doc, {
      autoConnect: true,
    });

    prov.awareness.setLocalStateField("user", {
      name: userName,
      color: myColor,
    });

    setYdoc(doc);
    setProvider(prov);

    return () => {
      prov.disconnect();
      doc.destroy();
    };
  }, [roomId, isMember, userName, myColor]);

  // 2. Setup Dynamic Cursors
  useEffect(() => {
    if (!provider) return;

    const dynamicCursor = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      const localClientId = provider.awareness.clientID;

      const currentUsers = [];
      states.forEach(([id, state]) => {
        if (state.user) {
          currentUsers.push({
            id,
            ...state.user,
            isMe: id === localClientId,
          });
        }
      });
      setActiveUsers(currentUsers);

      let styleEl = document.getElementById("y-monaco-dynamic-cursors");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "y-monaco-dynamic-cursors";
        document.head.appendChild(styleEl);
      }

      let css = "";
      states.forEach(([clientId, state]) => {
        if (clientId === localClientId) return;

        if (state?.user) {
          const { color, name } = state.user;
          css += `
            .yRemoteSelection-${clientId} {
              background-color: ${color}40 !important;
            }
            .yRemoteSelectionHead-${clientId} {
              position: absolute;
              border-left: 2px solid ${color};
              height: 100%;
              box-sizing: border-box;
              z-index: 10;
            }
            .yRemoteSelectionHead-${clientId}::after {
              content: "${name}";
              position: absolute;
              top: 0px;
              left: 4px;
              background-color: ${color};
              color: #000;
              font-size: 10px;
              font-family: monospace;
              font-weight: bold;
              padding: 0px 4px;
              border-radius: 2px;
              white-space: nowrap;
              pointer-events: none;
              z-index: 100;
            }
          `;
        }
      });
      styleEl.innerHTML = css;
    };

    provider.awareness.on("change", dynamicCursor);
    dynamicCursor();

    return () => {
      provider.awareness.off("change", dynamicCursor);
      const styleEl = document.getElementById("y-monaco-dynamic-cursors");
      if (styleEl) styleEl.remove();
    };
  }, [provider]);

  
  useEffect(() => {
    if (!ydoc || !provider || !editor || !activeFile) return;

    // Use a unique text identifier for each file in Yjs
    const ytext = ydoc.getText(activeFile._id);
    
    // Optional: if the document is totally empty locally and we have DB content, seed it
    if (ytext.toString() === "" && activeFile.content) {
      ytext.insert(0, activeFile.content);
    }

    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    return () => {
      binding.destroy();
    };
  }, [ydoc, provider, editor, activeFile]);

  useEffect(() => {
    if (roomId && isMember) {
      connectSocket(roomId);
    }
    return () => {
      if (isMember) disconnectSocket();
    };
  }, [roomId, isMember, connectSocket, disconnectSocket]);

  const fetchFiles = useProjectStore((state) => state.fetchFiles);
  useEffect(() => {
    if (roomId && isMember) {
      fetchFiles(roomId);
    }
  }, [roomId, isMember, fetchFiles]);
  

  if (projectLoading || !currentProject) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isMember) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white">
        <div className="bg-[#0d0d0d] p-8 rounded-lg border border-gray-800 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2">{currentProject.title}</h2>
          <p className="text-gray-400 mb-6">You are not a member of this project.</p>
          
          {currentProject.isPublic ? (
            <button 
              onClick={handleJoin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Join Project
            </button>
          ) : hasRequested ? (
            <div className="space-y-4">
              <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-3 rounded text-sm">
                Your request to join is pending approval.
              </div>
              <button 
                onClick={handleCancelRequest}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Cancel Request
              </button>
            </div>
          ) : (
            <button 
              onClick={handleRequest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Request Access
            </button>
          )}
        </div>
      </div>
    );
  }


  return (
  <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">

    <RoomNavbar
      theme={theme}
      setTheme={setTheme}
    />

    <div className="flex flex-1 min-h-0 overflow-hidden">

      <RoomSidebar activeUsers={activeUsers} />

      <div
        className="
          flex
          flex-col
          flex-1
          min-w-0
          min-h-0
          border-l
          border-gray-800
        "
      >

        {/* Tabs */}
        <div
          className="
            flex
            bg-[#0d0d0d]
            border-b
            border-gray-800
            overflow-x-auto
            whitespace-nowrap
            no-scrollbar
          "
        >

          {openTabs.map((tab) => (
            <div
              key={tab._id}
              className={`
                flex
                items-center
                shrink-0
                gap-2
                px-3 sm:px-4
                py-2
                cursor-pointer
                border-r
                border-gray-800
                text-xs sm:text-sm

                ${
                  activeFile?._id === tab._id
                    ? "bg-[#1a1a1a] text-white border-t-2 border-t-blue-500"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]/50"
                }
              `}
              onClick={() => setActiveFile(tab)}
            >

              <span className="truncate max-w-[120px] sm:max-w-none">
                {tab.name}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab._id || tab.name);
                }}
                className="
                  hover:bg-gray-700
                  rounded-md
                  p-0.5
                  ml-1
                  transition-colors
                  shrink-0
                "
              >
                <X size={14} />
              </button>

            </div>
          ))}

        </div>

        {/* Editor */}
        <div
          className="
            flex-1
            relative
            min-h-0
            w-full
            bg-[#1a1a1a]
          "
        >

          {activeFile ? (
            <Editor
              height="100%"
              width="100%"
              theme={theme}
              language={
                activeFile.language ||
                "javascript"
              }
              onMount={(editor) =>
                setEditor(editor)
              }
              options={{
                padding: { top: 16 },

                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },

                automaticLayout: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: true,

                minimap: {
                  enabled: false,
                },

                wordWrap: "on",

                fontSize:
                  window.innerWidth < 640
                    ? 12
                    : 14,
              }}
            />
          ) : (
            <div
              className="
                flex
                items-center
                justify-center
                h-full
                text-gray-500
                text-center
                px-6
              "
            >
              Select a file from the
              sidebar to start coding
            </div>
          )}

        </div>

      </div>

    </div>

  </div>
);
};

export default Room;
