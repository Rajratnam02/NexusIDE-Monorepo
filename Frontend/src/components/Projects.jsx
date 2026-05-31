import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { useAuthStore } from "../stores/AuthStore";
import { useProjectStore } from "../stores/ProjectStore";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const user = useAuthStore((state) => state.user);
  const { myProjects, fetchMyProjects, createProject, loading } =
    useProjectStore();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (newProjectName && newProjectName.trim()) {
      try {
        const newProject = await createProject(newProjectName.trim());
        if (newProject && newProject.roomId) {
          navigate(`/room/${newProject.roomId}`);
        }
      } catch (error) {
        alert("Failed to create project. Please try again.");
        console.log(error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 px-4 sm:px-6 lg:px-10 mt-8 lg:mt-12">
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.displayName || "Developer"}
          </p>

          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Ready to build something amazing today?
          </p>
        </div>

        {/* Create Project */}
        {isCreating ? (
          <form
            onSubmit={handleCreateProject}
            className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
          >
            <input
              type="text"
              autoFocus
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name..."
              className="bg-[#111111] border border-gray-800 text-gray-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500/50 transition-all w-full sm:w-[260px]"
            />

            <button
              type="submit"
              disabled={loading || !newProjectName.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewProjectName("");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Plus />

            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-10 pt-8 lg:pt-12">
        {myProjects?.map((project) => {
          const mappedData = {
            id: project.roomId,
            name: project.title,
            lang: project.files?.[0]?.language || "Multi",
            files: project.files?.length || 0,
            lastEdit: new Date(project.updatedAt).toLocaleDateString(),
            collaborators:
              project.members?.map(
                (m) => m.user?.displayName?.charAt(0)?.toUpperCase() || "U",
              ) || [],
            isLive: false,
          };

          return (
            <div
              key={project.roomId}
              onClick={() => navigate(`/room/${project.roomId}`)}
            >
              <ProjectCard data={mappedData} />
            </div>
          );
        })}
      </div>

      {!loading && myProjects?.length === 0 && (
        <div className="px-4 sm:px-6 lg:px-10 mt-10 flex justify-center text-gray-500 text-center">
          <p>No projects found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
