import {
  ChevronLeft,
  FilesIcon,
  MessagesSquare,
  Settings,
  Users,
  Send,
  Plus,
  UserPlus,
  UserMinus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Messages from "./Messages";
import Icons from "./Icons";
import UserBox from "./UserBox";
import FilesDiv from "./FilesDiv";
import { useProjectStore } from "../stores/ProjectStore";
import PopUps from "./PopUps";
import { useEditorStore } from "../stores/EditorStore";
import { useChatStore } from "../stores/ChatStore";
import { useMemberStore } from "../stores/MemberStore";

const RoomSidebar = ({ activeUsers }) => {
  const { roomId } = useParams();
  const [expanded, setExpanded] = useState(false);
  const generalClass =
    "border-r border-gray-800 bg-[#0d0d0d] transition-all duration-300 flex flex-col items-center py-4 gap-6 shrink-0";
  const nonExpandedClass = "w-12";
  const expandedClass = "w-64";
  const [active, setActive] = useState("files");
  const iconClass = `cursor-pointer transition-colors text-gray-600 group hover:text-gray-400 disabled:text-blue-400`;

  const { files, createFile, renameFile, deleteFile } = useProjectStore();
  const setActiveFile = useEditorStore((state) => state.setActiveFile);

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // "create", "rename", "delete"
    file: null,
    inputValue: "",
  });

  const openModal = (type, file = null) => {
    setModalState({
      isOpen: true,
      type,
      file,
      inputValue: type === "rename" ? file.name : "",
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, file: null, inputValue: "" });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const { type, file, inputValue } = modalState;

    try {
      if (type === "create") {
        if (!inputValue.trim()) return;
        const ext = inputValue.split(".").pop();
        let language = "javascript";
        if (ext === "py") language = "python";
        else if (ext === "cpp") language = "cpp";
        else if (ext === "css") language = "css";
        else if (ext === "html") language = "html";
        await createFile(roomId, inputValue, language);
      } else if (type === "rename") {
        if (!inputValue.trim() || inputValue === file.name) return;
        await renameFile(roomId, file._id, inputValue);
      } else if (type === "delete") {
        await deleteFile(roomId, file._id);
      } else if (type === "addMember") {
        if (!inputValue.trim()) return;
        await useMemberStore.getState().addMember(roomId, inputValue, "editor");
      }
      closeModal();
    } catch (err) {
      alert(`Failed to ${type}`);
    }
  };

  const clickHandler = (name) => {
    setExpanded(true);
    setActive(name);
  };

  const { members, pendingRequests, fetchMembers, fetchPendingRequests, acceptJoin, rejectJoin } = useMemberStore();

  useEffect(() => {
    fetchMembers(roomId);
    fetchPendingRequests(roomId);
  }, [roomId, fetchMembers, fetchPendingRequests]);

  const fetchMessages = useChatStore((state) => state.fetchMessages);

  useEffect(() => {
    fetchMessages(roomId);
  },[roomId]);

  const chatMessages = useChatStore((state) => state.messages);
  
  const [msgInput, setMsgInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    await useChatStore.getState().sendMessage(roomId, msgInput);
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
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    clickHandler("files");
                  }}
                  disabled={active == "files"}
                  name="files"
                  className={iconClass + " flex items-center gap-4"}
                >
                  <FilesIcon size={20} />
                  <span className="text-sm font-medium">Files</span>
                </button>
                {active === "files" && (
                  <button
                    onClick={() => openModal("create")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              {active == "files" && (
                <div className="flex flex-col gap-3 pl-9 pb-6">
                  {files &&
                    files.map((file) => (
                      <FilesDiv
                        key={file._id}
                        file={file}
                        onRename={(f) => openModal("rename", f)}
                        onDelete={(f) => openModal("delete", f)}
                        onClick={() => setActiveFile(file)}
                      />
                    ))}
                  {(!files || files.length === 0) && (
                    <span className="text-xs text-gray-500">
                      No files found
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    clickHandler("users");
                  }}
                  disabled={active == "users"}
                  name="users"
                  className={iconClass + " flex items-center gap-4"}
                >
                  <Users size={20} />
                  <span className="text-sm font-medium">Users</span>
                </button>
                {active === "users" && (
                  <button
                    onClick={() => openModal("addMember")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <UserPlus size={16} />
                  </button>
                )}
              </div>
              {active == "users" && (
                <div className="flex flex-col gap-4 pl-9 pb-6 pr-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Online Now</div>
                  {activeUsers &&
                    activeUsers.map((user) => <UserBox key={user.id} name={user.name} />)}
                    
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Project Members</div>
                  {members && members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between group/member">
                      <UserBox name={member.user?.name || "Unknown"} />
                      <div className="flex items-center gap-2">
                        <select
                          className="text-[10px] uppercase font-bold text-gray-400 bg-gray-800 px-1 py-0.5 rounded outline-none cursor-pointer"
                          value={member.role}
                          onChange={(e) => changeRole(roomId, member.user?._id || member.userId, e.target.value)}
                        >
                          <option value="owner">Owner</option>
                          <option value="co-leader">Co-Leader</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={() => useMemberStore.getState().removeMember(roomId, member.user?._id || member.userId)}
                          className="opacity-0 group-hover/member:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                        >
                          <UserMinus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingRequests && pendingRequests.length > 0 && (
                    <>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Pending Requests</div>
                      {pendingRequests.map((req) => (
                        <div key={req._id} className="flex flex-col gap-2 bg-gray-800/50 p-3 rounded-md border border-gray-700">
                          <span className="text-sm font-medium text-gray-200">{req.name || req.email}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => acceptJoin(roomId, req._id)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors flex-1 font-medium">Accept</button>
                            <button onClick={() => rejectJoin(roomId, req._id)} className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded transition-colors flex-1 font-medium">Reject</button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
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
                    {chatMessages && chatMessages.map((msg) => (
                      <Messages key={msg._id || msg.id || Date.now()} msg={msg} />
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

      <PopUps
        isOpen={modalState.isOpen}
        type={modalState.type}
        file={modalState.file}
        inputValue={modalState.inputValue}
        setInputValue={(val) =>
          setModalState({ ...modalState, inputValue: val })
        }
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default RoomSidebar;
