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

const Room = () => {
  const [theme, setTheme] = useState("vs-dark");

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("dracula", draculaTheme);
      monaco.editor.defineTheme("monokai", monokaiProTheme);
      monaco.editor.defineTheme("onedark", oneDarkTheme);
      monaco.editor.defineTheme("nord", nordTheme);
      monaco.editor.defineTheme("github-dark", githubDarkTheme);
    }
  }, [monaco]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      <RoomNavbar theme={theme} setTheme={setTheme} />

      <div className="flex-1 flex ">
        <RoomSidebar />

        <div className="flex flex-col flex-1 border-l border-gray-800 min-w-0">
          <div className="flex-1 w-full relative h-full">
            <Editor
              height={"100%"}
              width={"100%"}
              theme={theme}
              defaultLanguage="javascript"
              defaultValue="// Try changing the themes now!"
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
