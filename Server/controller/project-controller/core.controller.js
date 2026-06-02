import { nanoid } from "nanoid";
import projectModel from "../../models/project.model.js";
import AppError from "../../middleware/AppError.js";
import asyncHandler from "../../middleware/asyncHandler.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("Project name is required.", 400));
  }

  const roomId = nanoid(10);

  const newProject = await projectModel.create({
    title: name,
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
});

export const getProjectDetails = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const project = await projectModel
    .findOne({ roomId })
    .populate("owner", "name photo email")
    .populate("members.user", "name photo email")
    .populate("requests", "email");

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel
    .find({ "members.user": req.user._id })
    .populate("owner", "name photo")
    .select("-files")
    .sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

export const getAllProjects = asyncHandler(async (req, res) => {
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
});

export const getProject = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const project = await projectModel
    .findOne({ roomId })
    .populate("owner", "name photo email")
    .populate("members.user", "name photo email");

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const updateProject = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const { name, isPublic } = req.body;

  const project = await projectModel.findOne({ roomId });

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  const updateData = {};
  if (name !== undefined) updateData.title = name;
  if (isPublic !== undefined) updateData.isPublic = isPublic;

  const updatedProject = await projectModel.findOneAndUpdate(
    { roomId },
    updateData,
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedProject,
  });
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const project = await projectModel.findOne({ roomId });

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return next(new AppError("Only owners can delete projects.", 403));
  }

  await projectModel.findOneAndDelete({ roomId });

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
