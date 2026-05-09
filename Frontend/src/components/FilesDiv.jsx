import React from "react";
import { Edit2, Trash2, FileText } from "lucide-react";

const FilesDiv = ({ file, onRename, onDelete, onClick }) => {
  return (
    <div className="flex items-center justify-between group text-gray-400 hover:text-white cursor-pointer transition-colors text-sm">
      <div className="flex items-center gap-2 overflow-hidden flex-1" onClick={onClick}>
        <FileText size={16} className="shrink-0" />
        <span className="truncate">{file?.name}</span>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onRename(file); }} className="hover:text-blue-400">
          <Edit2 size={14} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(file); }} className="hover:text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default FilesDiv;

// 1 2 2 3 1
// 1 1 2 1 
// n(a - b) , n(a + b)
// c , d