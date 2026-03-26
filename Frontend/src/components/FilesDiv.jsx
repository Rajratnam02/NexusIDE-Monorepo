import React from "react";

const FilesDiv = ({ filename }) => {
  return (
    <span className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
      {filename}
    </span>
  );
};

export default FilesDiv;
