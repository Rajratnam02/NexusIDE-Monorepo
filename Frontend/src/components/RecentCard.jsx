import {
  ChevronRight,
  Clock,
  Clock1,
  Edit3,
  GitBranch,
  GitFork,
  InfoIcon,
  PlayCircle,
  Plus,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import React from "react";

const RecentCard = ({ data }) => {
  const iconClass = {
    JOINED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    CREATED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    PUSHED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    EXECUTED: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    DELETED: "bg-red-500/10 text-red-500 border-red-500/20",
    INVITED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    RENAMED: "bg-slate-500/10 text-slate-400 border-slate-700",
    FORKED: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  };

  const activityIcons = {
    JOINED: <UserPlus size={18} />,
    CREATED: <Plus size={18} />,
    PUSHED: <GitBranch size={18} />,
    EXECUTED: <PlayCircle size={18} />,
    DELETED: <Trash2 size={18} />,
    INVITED: <ShieldCheck size={18} />,
    RENAMED: <Edit3 size={18} />,
    FORKED: <GitFork size={18} />,
  };
  const icon = data.type;
  const generalClass =
    "p-5 h-fit rounded-2xl absolute -translate-x-1/2 translate-y-1/2 border-2 shadow-xl transition-all duration-300";

  return (
    <div className="border-l w-full  flex relative  first:mt-10 border-blue-950 last:border-0 last:[&_.child]:block ">
      <div className={generalClass + " " + iconClass[icon]}>
        {activityIcons[icon]}
      </div>
      <div className="child hidden absolute  top-0 left-0 h-8  w-px bg-blue-950 border-blue-950 "></div>
      <div className="bg-[#111111] border border-gray-800/50 my-5 rounded-2xl p-5 hover:border-blue-500/30 transition-all cursor-default flex-1 ml-15 mr-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-100">{data.user}</span>
              <span className="text-gray-500 text-xs tracking-wide uppercase font-bold">
                {data.type}
              </span>
              <span className="text-blue-400 font-mono text-sm hover:underline cursor-pointer">
                #{data.project}
              </span>
            </div>

            <p className="text-gray-400 text-sm font-mono bg-black/30 px-3 py-1.5 rounded-lg border border-gray-800/50 mt-2">
              <span className="text-green-500 mr-2">$</span>
              &nbsp;{data.description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock size={12} />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  {data.time}
                </p>
              </div>
            </div>

            <div className="p-2 hover:bg-gray-800 rounded-lg text-gray-600 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentCard;
