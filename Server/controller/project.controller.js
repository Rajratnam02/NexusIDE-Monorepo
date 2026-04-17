import projectModel from "../models/project.model.js";
import { nanoid } from "nanoid";

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

export const joinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (isMember) {
      return res
        .status(400)
        .json({ success: false, message: "Already a member" });
    }

    project.members.push({ user: req.user._id, role: "editor" });
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Owners cannot leave. Transfer ownership or delete project.",
        });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.user._id.toString(),
    );
    await project.save();

    res
      .status(200)
      .json({ success: true, message: "Left project successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestJoin = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project.requests.includes(req.user._id)) {
      project.requests.push(req.user._id);
      await project.save();
    }

    res.status(200).json({ success: true, message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelJoin = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    project.requests = project.requests.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );
    await project.save();

    res.status(200).json({ success: true, message: "Join request cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {};

export const unblockUser = async (req, res) => {};

export const acceptJoin = async (req, res) => {};

export const rejectJoin = async (req, res) => {};

export const getAllMembers = async (req, res) => {};

export const getPendingMembers = async (req, res) => {};

export const getBlockedMembers = async (req, res) => {};

export const addMembers = async (req, res) => {};

export const removeMembers = async (req, res) => {};

export const changeRole = async (req, res) => {};

export const createFile = async (req, res) => {};

export const deleteFile = async (req, res) => {};

export const updateFile = async (req, res) => {};

export const getAllFiles = async (req, res) => {};

export const getFile = async (req, res) => {};
