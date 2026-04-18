import { nanoid } from "nanoid";
import projectModel from "../../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }

    const roomId = nanoid(10);

    const newProject = await projectModel.create({
      name,
      roomId,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
      files: [
        {
          name: "main.js",
          content: "// Welcome to Nexus IDE\nconsole.log('Hello World!');",
          language: "javascript",
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const project = await projectModel
      .findOne({ roomId })
      .populate("owner", "name photo email")
      .populate("members.user", "name photo email");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await projectModel
      .find({
        "members.user": req.user._id,
      })
      .populate("owner", "name photo")
      .select("-files")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get My Projects Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel
      .find({ isPublic: true })
      .populate("owner", "name photo")
      .select("-files")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get All Projects Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await projectModel
      .findById(projectId)
      .populate("owner", "name photo email")
      .populate("members.user", "name photo email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, isPublic } = req.body;

    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only owners can update project settings",
      });
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { name, isPublic },
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Only owners can delete projects" });
    }

    await projectModel.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
