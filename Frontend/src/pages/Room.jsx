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
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F333FF",
  "#33FFF3",
  "#FFD133",
];

const Room = () => {
  const [theme, setTheme] = useState("vs-dark");
  const { roomId } = useParams();
  const location = useLocation();
  const monaco = useMonaco();

  const [editor, setEditor] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  const [userName] = useState(
    () => location.state?.name || `User-${Math.floor(Math.random() * 1000)}`,
  );
  const [myColor] = useState(
    () => COLORS[Math.floor(Math.random() * COLORS.length)],
  );

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("dracula", draculaTheme);
      monaco.editor.defineTheme("monokai", monokaiProTheme);
      monaco.editor.defineTheme("onedark", oneDarkTheme);
      monaco.editor.defineTheme("nord", nordTheme);
      monaco.editor.defineTheme("github-dark", githubDarkTheme);
    }
  }, [monaco]);

  useEffect(() => {
    if (!editor) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      `nexus-ide-${roomId}`,
      ydoc,
    );

    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: myColor,
    });

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

    const ytext = ydoc.getText("monaco");
    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    return () => {
      provider.awareness.off("change", dynamicCursor);
      binding.destroy();
      provider.disconnect();
      ydoc.destroy();
      const styleEl = document.getElementById("y-monaco-dynamic-cursors");
      if (styleEl) styleEl.remove();
    };
  }, [editor, roomId, userName, myColor]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      <RoomNavbar theme={theme} setTheme={setTheme} />

      <div className="flex-1 flex">
        <RoomSidebar activeUsers={activeUsers} />

        <div className="flex flex-col flex-1 border-l border-gray-800 min-w-0">
          <div className="flex-1 w-full relative h-full">
            <Editor
              height={"100%"}
              width={"100%"}
              theme={theme}
              defaultLanguage="cpp"
              onMount={(editor) => setEditor(editor)}
              options={{
                padding: { top: 16 },
                scrollbar: { vertical: "hidden", horizontal: "hidden" },
                automaticLayout: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
