import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/protect.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { clearProjectChat, deleteMessage, getMessages, sendMessage } from "../controller/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/:roomId", protect, authorize(["owner", "co-leader", "editor", "viewer"]), getMessages);

messageRoutes.post(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader", "editor", "viewer"]),
  body("content").trim().notEmpty().withMessage("Message content cannot be empty").isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters"),
  validate,
  sendMessage,
);

messageRoutes.delete("/:roomId/:messageId", protect, authorize(["owner", "co-leader", "editor", "viewer"]), deleteMessage);
messageRoutes.delete("/:roomId", protect, authorize(["owner", "co-leader"]), clearProjectChat);

export default messageRoutes;
