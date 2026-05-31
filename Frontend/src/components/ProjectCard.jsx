import { Code2 } from "lucide-react";
import React from "react";

const ProjectCard = ({ data }) => {
  return (
    <div className="group bg-[#111111] border border-gray-800 rounded-2xl p-5 sm:p-6 hover:border-blue-500/50 hover:bg-[#141414] transition-all cursor-pointer h-full">
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
          <Code2 size={24} />
        </div>

        <p className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors truncate">
          {data.name}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <p className="text-[10px] px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md font-bold uppercase tracking-widest">
            {data.lang}
          </p>

          <p className="text-[10px] text-gray-600 font-medium">
            {data.files} Files
          </p>
        </div>

        <div className="border-t border-gray-800 flex justify-between items-center mt-8 pt-4 gap-4">
          <div className="flex -space-x-2 overflow-hidden">
            {data.collaborators.slice(0, 3).map((initials, index) => (
              <div
                key={index}
                className="h-7 w-7 rounded-full bg-gray-800 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase shrink-0"
              >
                {initials}
              </div>
            ))}

            {data.collaborators.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-blue-600 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                +{data.collaborators.length - 3}
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-[10px] text-gray-600 uppercase font-bold">
              Last Edit
            </p>

            <p className="text-xs text-gray-400">{data.lastEdit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
