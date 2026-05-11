import React from "react";

const Messages = ({ msg }) => {
  const senderName = typeof msg.sender === 'object' ? msg.sender.name || msg.sender.email || "Unknown" : msg.sender || "User";
  const color = msg.color || "text-blue-400";
  const content = msg.content || msg.text || "";

  return (
    <div className="text-xs text-gray-300 bg-gray-800/40 p-2.5 rounded-md border border-gray-800 break-words">
      <span className={`${color} font-semibold block mb-1`}>
        {senderName}
      </span>
      {content}
    </div>
  );
};

export default Messages;
