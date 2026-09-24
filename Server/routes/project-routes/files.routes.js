import express from "express";
import { body } from "express-validator";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { createFile, deleteFile, getAllFiles, getFile, updateFile } from "../../controller/project-controller/files.controller.js";

const SUPPORTED_LANGUAGES = ["javascript","typescript","python","java","cpp","c","go","rust","php","ruby","kotlin","swift","html","css","sql","json","markdown","bash","yaml","plaintext"];

const fileRoutes = express.Router();

fileRoutes.post(
  "/:roomId/files",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  body("name").trim().notEmpty().withMessage("File name is required").isLength({ min: 1, max: 100 }).withMessage("File name must be 1-100 characters").matches(/^[a-zA-Z0-9._\-\s]+$/).withMessage("File name contains invalid characters"),
  body("language").optional().isIn(SUPPORTED_LANGUAGES).withMessage("Unsupported language"),
  validate,
  createFile,
);

fileRoutes.get("/:roomId/files", protect, authorize(["owner", "co-leader", "editor"]), getAllFiles);
fileRoutes.get("/:roomId/files/:fileId", protect, authorize(["owner", "co-leader", "editor"]), getFile);

fileRoutes.patch(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  body("name").optional().trim().isLength({ min: 1, max: 100 }).withMessage("File name must be 1-100 characters").matches(/^[a-zA-Z0-9._\-\s]+$/).withMessage("File name contains invalid characters"),
  body("content").optional().isString().withMessage("File content must be a string"),
  validate,
  updateFile,
);

fileRoutes.delete("/:roomId/files/:fileId", protect, authorize(["owner", "co-leader", "editor"]), deleteFile);

export default fileRoutes;
