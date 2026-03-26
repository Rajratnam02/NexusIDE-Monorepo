import {
  ChevronLeft,
  FilesIcon,
  MessagesSquare,
  Settings,
  Users,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import Messages from "./Messages";
import Icons from "./Icons";

const RoomSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const generalClass =
    "border-r border-gray-800 bg-[#0d0d0d] transition-all duration-300 flex flex-col items-center py-4 gap-6 shrink-0";
  const nonExpandedClass = "w-12";
  const expandedClass = "w-64";
  const [active, setActive] = useState("files");
  const iconClass = `cursor-pointer transition-colors text-gray-600 group hover:text-gray-400 disabled:text-blue-400`;

  const clickHandler = (name) => {
    setExpanded(true);
    setActive(name);
  };

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Rajratnam",
      color: "text-blue-400",
      text: "Hey team, let's start!",
    },
    {
      id: 2,
      sender: "Guest_404",
      color: "text-purple-400",
      text: "Ready when you are.",
    },
  ]);
  const [msgInput, setMsgInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: Date.now(),
        sender: "Rajratnam (You)",
        color: "text-green-400",
        text: msgInput,
      },
    ]);
    setMsgInput("");
  };

  return (
    <div
      className={
        generalClass + " " + (expanded ? expandedClass : nonExpandedClass)
      }
    >
      {!expanded && (
        <div className="text-white h-full flex flex-col">
          <div className="gap-6 flex flex-col">
            <Icons
              active={active}
              name={"files"}
              icon={<FilesIcon size={20} />}
              clickHandler={clickHandler}
            />

            <Icons
              active={active}
              name={"users"}
              icon={<Users size={20} />}
              clickHandler={clickHandler}
            />

            <Icons
              active={active}
              name={"messages"}
              icon={<MessagesSquare size={20} />}
              clickHandler={clickHandler}
            />
          </div>
          <div className="mt-auto">
            <Icons
              active={active}
              name={"setting"}
              icon={<Settings size={20} />}
              clickHandler={clickHandler}
            />
          </div>
        </div>
      )}

      {expanded && (
        <div className="text-white h-full flex flex-col w-full px-6 py-2">
          <div className="flex mb-8">
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  clickHandler("files");
                }}
                disabled={active == "files"}
                name="files"
                className={iconClass + " flex items-center gap-4 mb-4"}
              >
                <FilesIcon size={20} />
                <span className="text-sm font-medium">Files</span>
              </button>
              {active == "files" && (
                <div className="flex flex-col gap-3 pl-9 pb-6">
                  <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                    index.js
                  </span>
                  <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                    App.js
                  </span>
                  <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                    styles.css
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <button
                onClick={() => {
                  clickHandler("users");
                }}
                disabled={active == "users"}
                name="users"
                className={iconClass + " flex items-center gap-4 mb-4"}
              >
                <Users size={20} />
                <span className="text-sm font-medium">Users</span>
              </button>
              {active == "users" && (
                <div className="flex flex-col gap-4 pl-9 pb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Rajratnam (You)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-400">Guest_404</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1">
              <button
                onClick={() => {
                  clickHandler("messages");
                }}
                disabled={active == "messages"}
                name="messages"
                className={iconClass + " flex items-center gap-4 mb-4"}
              >
                <MessagesSquare size={20} />
                <span className="text-sm font-medium">Messages</span>
              </button>
              {active == "messages" && (
                <div className="flex flex-col flex-1 pl-9 pb-2">
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-62.5 no-scrollbar mb-3">
                    {chatMessages.map((msg) => (
                      <Messages msg={msg} />
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-gray-800/50 text-xs text-white px-3 py-2 rounded-md outline-none border border-gray-700 focus:border-gray-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!msgInput.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white p-2 rounded-md transition-colors flex shrink-0 items-center justify-center"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto flex items-center gap-4 text-gray-600 hover:text-gray-400 cursor-pointer transition-colors pt-6 border-t border-gray-800/50">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSidebar;
