import React from "react";

const Icons = ({ active, name, icon, clickHandler }) => {
  return (
    <div
      onClick={() => {
        clickHandler(name);
      }}
      className={`cursor-pointer transition-colors ${active === name ? "text-blue-400" : "text-gray-600 group hover:text-gray-400"}`}
    >
      {icon}
    </div>
  );
};

export default Icons;
