import { Folder } from "lucide-react";
import React from "react";

const CollabList = ({ data }) => {

  const roleClass =
    data.role === "editor"
      ? "bg-blue-500/10 text-blue-400"
      : "bg-gray-800 text-gray-500";

  return (
    <div
      className="
        border border-gray-800/50
        md:border-t-0
        last:rounded-b-2xl

        hover:bg-[#161616]
        transition-all
        cursor-pointer
        group

        p-4 md:px-6 md:py-5
      "
    >

      {/* MOBILE CARD */}
      <div className="md:hidden flex flex-col gap-4">

        <div className="flex items-center gap-3">

          <Folder
            size={18}
            className="text-gray-600 group-hover:text-blue-500 transition-colors"
          />

          <div>

            <p className="font-bold text-gray-200 break-words">
              {data.name}
            </p>

            <p className="text-[10px] text-blue-500 font-bold uppercase">
              {data.lang}
            </p>

          </div>

        </div>

        <div className="flex justify-between items-center">

          <p className="text-sm text-gray-400">
            {data.owner}
          </p>

          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${roleClass}`}
          >
            {data.role}
          </span>

        </div>

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:grid grid-cols-12 items-center">

        <div className="col-span-6 flex items-center gap-3">

          <Folder
            size={18}
            className="text-gray-600 group-hover:text-blue-500 transition-colors"
          />

          <div>

            <p className="font-bold text-gray-200">
              {data.name}
            </p>

            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">
              {data.lang}
            </p>

          </div>

        </div>

        <div className="col-span-4 text-sm text-gray-400">
          {data.owner}
        </div>

        <div className="col-span-2 text-right">

          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${roleClass}`}
          >
            {data.role}
          </span>

        </div>

      </div>

    </div>
  );
};

export default CollabList;