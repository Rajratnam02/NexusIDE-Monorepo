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
    <div className="flex-1 pb-7 flex-col flex ">
      <div className="flex mx-15 mt-15 items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.displayName || "Developer"}
          </p>
          <p className="text-gray-400 mt-1">
            Ready to build something amazing today?
          </p>
        </div>

        {isCreating ? (
          <form
            onSubmit={handleCreateProject}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name..."
              className="bg-[#111111] border border-gray-800 text-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-blue-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !newProjectName.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewProjectName("");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <Plus />
            <p>New Project</p>
          </button>
        )}
      </div>

      <div className=" flex-1 grid grid-cols-1 gap-6 px-15 pt-15 lg:grid-cols-3 ">
        {myProjects &&
          myProjects.map((project) => {
            // Map backend project data to what ProjectCard expects
            const mappedData = {
              id: project.roomId,
              name: project.title,
              lang:
                project.files && project.files.length > 0
                  ? project.files[0].language
                  : "Multi",
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

      {!loading && myProjects && myProjects.length === 0 && (
        <div className="px-15 mt-10 flex flex-col items-center text-gray-500">
          <p>No projects found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
