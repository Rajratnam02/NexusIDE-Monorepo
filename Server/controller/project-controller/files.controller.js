import projectModel from "../../models/project.model.js";

export const createFile = async (req, res) => {
  try {
    const { name, language } = req.body;

    const fileExists = req.project.files.some(f => f.name === name);
    if (fileExists) {
      return res.status(400).json({ success: false, message: "File already exists" });
    }

    const newFile = {
      name,
      content: "", 
      language: language || "javascript"
    };

    req.project.files.push(newFile);
    await req.project.save();

    res.status(201).json({ success: true, data: newFile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.body;

    req.project.files = req.project.files.filter(f => f.name !== fileName);
    await req.project.save();

    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateFile = async (req, res) => {
  try {
    const { fileName, content, newName } = req.body;

    const file = req.project.files.find(f => f.name === fileName);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    if (content !== undefined) file.content = content;
    if (newName) file.name = newName;

    await req.project.save();
    res.status(200).json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllFiles = async (req, res) => {
  try {
    
    res.status(200).json({
      success: true,
      data: req.project.files
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    const file = req.project.files.find(f => f.name === fileName);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};