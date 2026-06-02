import projectModel from "../../models/project.model.js";
import { getIO } from "../../realtime/socket.js";
import AppError from "../../middleware/AppError.js";
import asyncHandler from "../../middleware/asyncHandler.js";

export const createFile = asyncHandler(async (req, res, next) => {
  const { name, language } = req.body;

  if (!name) {
    return next(new AppError("File name is required.", 400));
  }

  const fileExists = req.project.files.some((f) => f.name === name);
  if (fileExists) {
    return next(new AppError("A file with that name already exists.", 409));
  }

  const newFile = {
    name,
    content: "",
    language: language || "javascript",
  };

  req.project.files.push(newFile);
  await req.project.save();

  const io = getIO();
  io.to(req.project.roomId).emit("project-event", {
    type: "FILE_CREATED",
    payload: { name, language, updatedAt: new Date() },
  });

  res.status(201).json({ success: true, data: newFile });
});

export const deleteFile = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;

  const fileToDelete = req.project.files.find(
    (f) => f._id.toString() === fileId
  );
  if (!fileToDelete) {
    return next(new AppError("File not found.", 404));
  }

  req.project.files = req.project.files.filter(
    (f) => f._id.toString() !== fileId
  );
  await req.project.save();

  const io = getIO();
  io.to(req.project.roomId).emit("project-event", {
    type: "FILE_DELETED",
    payload: { fileId },
  });

  res.status(200).json({ success: true, message: "File deleted successfully" });
});

export const updateFile = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;
  const { content, name } = req.body;

  const file = req.project.files.find((f) => f._id.toString() === fileId);
  if (!file) {
    return next(new AppError("File not found.", 404));
  }

  const oldName = file.name;

  if (content !== undefined) file.content = content;
  if (name) file.name = name;
  await req.project.save();

  const io = getIO();
  io.to(req.project.roomId).emit("project-event", {
    type: "FILE_UPDATED",
    payload: {
      fileId: file._id,
      oldName,
      newName: file.name,
      updatedBy: req.user._id,
    },
  });

  res.status(200).json({ success: true, data: file });
});

export const getAllFiles = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.project.files,
  });
});

export const getFile = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;

  const file = req.project.files.find((f) => f._id.toString() === fileId);
  if (!file) {
    return next(new AppError("File not found.", 404));
  }

  res.status(200).json({ success: true, data: file });
});
