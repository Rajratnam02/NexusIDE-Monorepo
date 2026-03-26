import React from "react";
import RoomNavbar from "../components/RoomNavbar";
import RoomSidebar from "../components/RoomSidebar";
import { Editor } from "@monaco-editor/react";

const Room = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]  flex flex-col">
      <RoomNavbar />

      <div className="flex-1 flex relative  border-white">
        <RoomSidebar />

        {/* <div className="border border-white flex-col flex-1 ml-12">
          <div className="h-110 border border-white">
            <Editor
              height={"100%"}
              width={"100%"}
              theme="vs-dark"
              options={{
                scrollbar: false,
                automaticLayout: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: true,
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Room;
