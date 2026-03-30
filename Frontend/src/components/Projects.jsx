import { Plus } from "lucide-react";
import React from "react";
import ProjectCard from "./ProjectCard";
import { useAuthStore } from "../stores/authStore";

const Projects = () => {
  const user = useAuthStore((state) => state.user)

  const projectsData = [
    {
      id: 1,
      name: "WheelSync Backend",
      lang: "NodeJs",
      files: 32,
      lastEdit: "2m",
      collaborators: ["RR", "AJ", "PK"],
      isLive: true,
    },
    {
      id: 2,
      name: "Nexus-IDE-Core",
      lang: "React",
      files: 124,
      lastEdit: "1h",
      collaborators: ["RR", "SK"],
      isLive: true,
    },
    {
      id: 3,
      name: "Algorithm Visualizer",
      lang: "C++",
      files: 12,
      lastEdit: "Yesterday",
      collaborators: ["RR"],
      isLive: false,
    },
    {
      id: 4,
      name: "DishDash Web",
      lang: "React",
      files: 45,
      lastEdit: "3d",
      collaborators: ["RR", "MS", "TJ", "LW"],
      isLive: false,
    },
  ];

  return (
    <div className="flex-1 pb-7 flex-col flex ">
      <div className="flex mx-15 mt-15 items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">Welcome back, {user.displayName}</p>
          <p className="text-gray-400 mt-1">
            Ready to build something amazing today?
          </p>
        </div>

        <div className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <Plus />
          <p>New Project</p>
        </div>
      </div>

      <div className=" flex-1 grid grid-cols-1 gap-6 px-15 pt-15 lg:grid-cols-3 ">
        {projectsData.map((data) => (
          <ProjectCard data={data} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
