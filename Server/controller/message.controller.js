
import messageModel from "../models/message.model.js";
import { getIO } from "../realtime/socket.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ projectId: req.project._id })
      .populate("sender", "name photo")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Chat history retrieved successfully",
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { roomId } = req.params;

    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Message content is required" });
    }

    const newMessage = await messageModel.create({
      content,
      sender: req.user._id,
      projectId: req.project._id,
    });

    const populated = await newMessage.populate("sender", "name photo");

    const io = getIO();
    io.to(roomId).emit("receive-chat", populated);

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: populated,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId, roomId } = req.params;
    const userId = req.user._id.toString();

    const message = await messageModel.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    const isAuthor = message.sender.toString() === userId;
    const isAdmin = ["owner", "co-leader"].includes(req.userRole);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message",
      });
    }

    await messageModel.findByIdAndDelete(messageId);

    const io = getIO();
    io.to(roomId).emit("message-deleted", messageId);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const clearProjectChat = async (req, res) => {
  try {
    const result = await messageModel.deleteMany({
      projectId: req.project._id,
    });

    const io = getIO();
    io.to(req.params.roomId).emit("chat-cleared");

    return res.status(200).json({
      success: true,
      message: "Project chat history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear Chat Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while clearing chat",
      error: error.message,
    });
  }
};
