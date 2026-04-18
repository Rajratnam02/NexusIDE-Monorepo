import express from "express";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createFile,
  deleteFile,
  getAllFiles,
  getFile,
  updateFile,
} from "../../controller/project-controller/files.controller.js";

const fileRoutes = express.Router();

fileRoutes.post(
  "/:roomId/files",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  createFile,
);

fileRoutes.get(
  "/:roomId/files",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  getAllFiles,
);

fileRoutes.get(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  getFile,
);

fileRoutes.patch(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  updateFile,
);

fileRoutes.delete(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  deleteFile,
);

export default fileRoutes;
