import React from "react";

const SidebarButton = ({ icon, title, selected, setSelected }) => {
  const active = selected === title;

  return (
    <button
      onClick={() => setSelected(title)}
      className={`
        w-full
        flex items-center
        gap-3
        px-4
        py-3
        rounded-xl
        cursor-pointer
        transition-all
        duration-200

        ${
          active
            ? "text-blue-500 bg-blue-600/10 font-semibold"
            : "text-gray-400 hover:bg-[#151515] hover:text-gray-200"
        }
      `}
    >
      <span className="shrink-0">{icon}</span>

      <span className="text-sm text-left truncate">{title}</span>
    </button>
  );
};

export default SidebarButton;
