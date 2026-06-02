import projectModel from "../../models/project.model.js";
import { getIO } from "../../realtime/socket.js";

export const createFile = async (req, res) => {
  try {
    const { name, language } = req.body;

    const fileExists = req.project.files.some((f) => f.name === name);
    if (fileExists) {
      return res
        .status(400)
        .json({ success: false, message: "File already exists" });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const fileToDelete = req.project.files.find((f) => f._id.toString() === fileId);
    if (!fileToDelete) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    req.project.files = req.project.files.filter((f) => f._id.toString() !== fileId);
    await req.project.save();
    
    const io = getIO();
    io.to(req.project.roomId).emit("project-event", {
      type: "FILE_DELETED",
      payload: { fileId },
    });

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { content, name } = req.body;

    const file = req.project.files.find((f) => f._id.toString() === fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
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
        updatedBy: req.user._id 
      }
    });
    
    res.status(200).json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.project.files,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = req.project.files.find((f) => f._id.toString() === fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
