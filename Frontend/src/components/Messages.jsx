import React from "react";

const Messages = ({ msg }) => {
  return (
    <div className="text-xs text-gray-300 bg-gray-800/40 p-2.5 rounded-md border border-gray-800">
      <span className={`${msg.color} font-semibold block mb-1`}>
        {msg.sender}
      </span>
        {msg.text}
    </div>
  );
};

export default Messages;
