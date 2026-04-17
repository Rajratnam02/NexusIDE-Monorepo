import express from "express";
import { protect } from "../middleware/protect.js";
import { authorize } from "../middleware/authorize.js";
import {
  clearProjectChat,
  deleteMessage,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader", "editor", "viewer"]),
  getMessages,
);

messageRoutes.post(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader", "editor", "viewer"]),
  sendMessage,
);

messageRoutes.delete(
  "/:roomId/:messageId",
  protect,
  authorize(["owner", "co-leader", "editor", "viewer"]),
  deleteMessage,
);

messageRoutes.delete(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  clearProjectChat,
);

export default messageRoutes;
