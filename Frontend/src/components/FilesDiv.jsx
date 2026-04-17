import React from "react";

const FilesDiv = ({ filename }) => {
  return (
    <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
      {filename}
    </span>
  );
};

export default FilesDiv;

// 1 2 2 3 1
// 1 1 2 1 
// n(a - b) , n(a + b)
// c , d