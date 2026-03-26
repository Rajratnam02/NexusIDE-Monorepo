import React from "react";

const UserBox = ({ name }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
      <span className="text-sm text-gray-400">{name}</span>
    </div>
  );
};

export default UserBox;
